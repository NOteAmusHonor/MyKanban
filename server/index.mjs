// @ts-nocheck
/* eslint-disable */
import express from 'express'
import { createServer } from 'node:http'
import { WebSocketServer } from 'ws'
import { watch } from 'chokidar'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PORT = parseInt(process.env.MYKANBAN_PORT ?? '3000', 10)

// kanban.json lives in the CWD of whoever runs "npx mykanban"
const KANBAN_FILE = resolve(process.cwd(), 'kanban.json')

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// ─── Default board data ────────────────────────────────────────────────────
const defaultData = {
  meta: {
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  },
  board: { id: 'board-1', name: 'Mein Kanban-Board' },
  columns: [
    { id: 'col-backlog', title: 'Backlog', order: 0, color: '#64748b' },
    { id: 'col-todo', title: 'Zu erledigen', order: 1, color: '#6366f1' },
    { id: 'col-inprogress', title: 'In Bearbeitung', order: 2, color: '#f97316' },
    { id: 'col-review', title: 'Review', order: 3, color: '#a855f7' },
    { id: 'col-done', title: 'Erledigt', order: 4, color: '#22c55e' },
  ],
  tickets: [],
}

if (!existsSync(KANBAN_FILE)) {
  writeFileSync(KANBAN_FILE, JSON.stringify(defaultData, null, 2), 'utf-8')
  console.log(`[MyKanban] Neue kanban.json erstellt: ${KANBAN_FILE}`)
}

// ─── Helpers ──────────────────────────────────────────────────────────────
/**
 * @returns {{ meta: any, board: any, columns: any[], tickets: any[] }}
 */
function readData() {
  try {
    const raw = readFileSync(KANBAN_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return structuredClone(defaultData)
  }
}

/** @param {{ meta?: any, board?: any, columns?: any[], tickets?: any[] }} data */
function writeData(data) {
  if (!data.meta) data.meta = {}
  data.meta.lastModified = new Date().toISOString()
  writeFileSync(KANBAN_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// ─── Express ──────────────────────────────────────────────────────────────
const app = express()
const httpServer = createServer(app)
const wss = new WebSocketServer({ server: httpServer })

app.use(express.json({ limit: '10mb' }))

// CORS — allow any origin (local tool only, not exposed to internet)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(204).end()
  next()
})

// Serve built frontend from dist/ (registered AFTER API routes as fallback)
const distPath = join(__dirname, '..', 'dist')
let sirvMiddleware = null
if (existsSync(distPath)) {
  const { default: sirv } = await import('sirv')
  sirvMiddleware = sirv(distPath, { single: true })
}

// ─── WebSocket broadcast ───────────────────────────────────────────────────
/**
 * @param {string} type
 * @param {any} payload
 */
function broadcast(type, payload) {
  const msg = JSON.stringify({ type, payload })
  wss.clients.forEach((client) => {
    if (client.readyState === 1 /* OPEN */) client.send(msg)
  })
}

// ─── File Watcher (for AI / external edits) ───────────────────────────────
let suppressWatcher = false

watch(KANBAN_FILE, { ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 150 } }).on(
  'change',
  () => {
    if (suppressWatcher) return
    try {
      const data = readData()
      broadcast('board-updated', data)
      console.log('[MyKanban] Externe Änderung erkannt → Broadcast an alle Clients')
    } catch {
      // invalid JSON during write — ignore
    }
  },
)

/** @param {() => void} fn */
function withSuppressedWatcher(fn) {
  suppressWatcher = true
  fn()
  setTimeout(() => {
    suppressWatcher = false
  }, 600)
}

// ─── API Routes ───────────────────────────────────────────────────────────

// GET /api/board — full board state
app.get('/api/board', (_req, res) => {
  res.json(readData())
})

// PUT /api/board — replace full board state (bulk sync)
app.put('/api/board', (req, res) => {
  withSuppressedWatcher(() => {
    writeData(req.body)
    broadcast('board-updated', req.body)
  })
  res.json({ ok: true })
})

// PATCH /api/board/meta — update board metadata (name etc.)
app.patch('/api/board/meta', (req, res) => {
  withSuppressedWatcher(() => {
    const data = readData()
    data.board = { ...data.board, ...req.body }
    writeData(data)
    broadcast('board-meta-updated', data.board)
  })
  res.json(readData().board)
})

// POST /api/tickets — create ticket
app.post('/api/tickets', (req, res) => {
  withSuppressedWatcher(() => {
    const data = readData()
    const ticket = req.body
    data.tickets.push(ticket)
    writeData(data)
    broadcast('ticket-created', ticket)
  })
  res.status(201).json(req.body)
})

// PATCH /api/tickets/:id — update ticket
app.patch('/api/tickets/:id', (req, res) => {
  const data = readData()
  const idx = data.tickets.findIndex((t) => t.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Ticket nicht gefunden' })
  data.tickets[idx] = { ...data.tickets[idx], ...req.body, updatedAt: new Date().toISOString() }
  withSuppressedWatcher(() => {
    writeData(data)
    broadcast('ticket-updated', data.tickets[idx])
  })
  res.json(data.tickets[idx])
})

// DELETE /api/tickets/:id — delete ticket
app.delete('/api/tickets/:id', (req, res) => {
  const data = readData()
  const idx = data.tickets.findIndex((t) => t.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Ticket nicht gefunden' })
  const [removed] = data.tickets.splice(idx, 1)
  withSuppressedWatcher(() => {
    writeData(data)
    broadcast('ticket-deleted', { id: removed.id })
  })
  res.json({ ok: true })
})

// POST /api/columns — create column
app.post('/api/columns', (req, res) => {
  withSuppressedWatcher(() => {
    const data = readData()
    data.columns.push(req.body)
    writeData(data)
    broadcast('column-created', req.body)
  })
  res.status(201).json(req.body)
})

// PATCH /api/columns/:id — update column
app.patch('/api/columns/:id', (req, res) => {
  const data = readData()
  const idx = data.columns.findIndex((c) => c.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Spalte nicht gefunden' })
  data.columns[idx] = { ...data.columns[idx], ...req.body }
  withSuppressedWatcher(() => {
    writeData(data)
    broadcast('column-updated', data.columns[idx])
  })
  res.json(data.columns[idx])
})

// DELETE /api/columns/:id — delete column (and all its tickets)
app.delete('/api/columns/:id', (req, res) => {
  const data = readData()
  const idx = data.columns.findIndex((c) => c.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Spalte nicht gefunden' })
  const [removed] = data.columns.splice(idx, 1)
  data.tickets = data.tickets.filter((t) => t.columnId !== req.params.id)
  withSuppressedWatcher(() => {
    writeData(data)
    broadcast('column-deleted', { id: removed.id })
  })
  res.json({ ok: true })
})

// PUT /api/columns/order — reorder columns
app.put('/api/columns/order', (req, res) => {
  // req.body = [{ id, order }, ...]
  withSuppressedWatcher(() => {
    const data = readData()
    const orderMap = Object.fromEntries(req.body.map((c) => [c.id, c.order]))
    data.columns = data.columns.map((c) => ({ ...c, order: orderMap[c.id] ?? c.order }))
    writeData(data)
    broadcast('board-updated', data)
  })
  res.json({ ok: true })
})

// PUT /api/tickets/order — reorder/move tickets
app.put('/api/tickets/order', (req, res) => {
  // req.body = [{ id, columnId, order }, ...]
  withSuppressedWatcher(() => {
    const data = readData()
    const map = Object.fromEntries(req.body.map((t) => [t.id, t]))
    data.tickets = data.tickets.map((t) => {
      const update = map[t.id]
      if (!update) return t
      return {
        ...t,
        columnId: update.columnId,
        order: update.order,
        updatedAt: new Date().toISOString(),
      }
    })
    writeData(data)
    broadcast('board-updated', data)
  })
  res.json({ ok: true })
})

// ─── WebSocket ────────────────────────────────────────────────────────────
wss.on('connection', (ws) => {
  console.log('[MyKanban] Browser verbunden')
  // Send current state on connect
  try {
    ws.send(JSON.stringify({ type: 'board-updated', payload: readData() }))
  } catch {
    /* ignore */
  }
  ws.on('close', () => console.log('[MyKanban] Browser getrennt'))
})

// ─── Static frontend fallback (after API routes) ─────────────────────────
if (sirvMiddleware) {
  app.use(sirvMiddleware)
}

// ─── Start ────────────────────────────────────────────────────────────────
export function startServer(openBrowser = false) {
  httpServer.listen(PORT, () => {
    console.log(``)
    console.log(`  ✨  MyKanban läuft auf  http://localhost:${PORT}`)
    console.log(`  📄  Daten:              ${KANBAN_FILE}`)
    console.log(`  🔌  WebSocket aktiv     (Echtzeit-Sync)`)
    console.log(``)
    if (openBrowser) {
      import('open').then(({ default: open }) => open(`http://localhost:${PORT}`)).catch(() => {})
    }
  })
  return httpServer
}

// ─── Auto-start when run directly: node server/index.mjs ─────────────────
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startServer()
}
