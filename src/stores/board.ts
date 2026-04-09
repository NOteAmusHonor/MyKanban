import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Board, Column, Ticket, KanbanFile, Priority, WsEvent } from '@/types'
import { generateId, generateTicketNumber } from '@/utils/helpers'
import { useUiStore } from '../stores/ui'

const API = import.meta.env.DEV ? 'http://localhost:3737' : ''
const WS_URL = import.meta.env.DEV ? 'ws://localhost:3737' : `ws://${window.location.host}`

export const useBoardStore = defineStore('board', () => {
  const ui = useUiStore()

  // ─── State ─────────────────────────────────────────────────────────────
  const board = ref<Board>({ id: 'board-1', name: 'Mein Kanban-Board' })
  const columns = ref<Column[]>([])
  const tickets = ref<Ticket[]>([])
  const loading = ref(false)
  const wsConnected = ref(false)

  // ─── WebSocket ─────────────────────────────────────────────────────────
  let ws: WebSocket | null = null
  let wsReconnectTimer: ReturnType<typeof setTimeout> | null = null

  function connectWebSocket() {
    if (ws && ws.readyState < 2) return // already open or connecting

    try {
      ws = new WebSocket(WS_URL)
    } catch {
      scheduleReconnect()
      return
    }

    ws.onopen = () => {
      wsConnected.value = true
      if (wsReconnectTimer) {
        clearTimeout(wsReconnectTimer)
        wsReconnectTimer = null
      }
    }

    ws.onclose = () => {
      wsConnected.value = false
      scheduleReconnect()
    }

    ws.onerror = () => {
      wsConnected.value = false
    }

    ws.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data as string) as WsEvent
        handleWsEvent(msg)
      } catch {
        /* ignore malformed messages */
      }
    }
  }

  function scheduleReconnect() {
    if (wsReconnectTimer) return
    wsReconnectTimer = setTimeout(() => {
      wsReconnectTimer = null
      connectWebSocket()
    }, 3000)
  }

  function handleWsEvent(msg: WsEvent) {
    switch (msg.type) {
      case 'board-updated': {
        const data = msg.payload as KanbanFile
        board.value = data.board
        columns.value = data.columns
        tickets.value = data.tickets
        ui.addAiEvent(msg.type, 'Board vollständig synchronisiert')
        break
      }
      case 'ticket-created': {
        const t = msg.payload as Ticket
        if (!tickets.value.find((x) => x.id === t.id)) {
          tickets.value.push(t)
          ui.addAiEvent(msg.type, `Ticket TK-${t.ticketNumber} „${t.title}" erstellt`)
        }
        break
      }
      case 'ticket-updated': {
        const t = msg.payload as Ticket
        const idx = tickets.value.findIndex((x) => x.id === t.id)
        if (idx !== -1) {
          tickets.value[idx] = t
          ui.addAiEvent(msg.type, `Ticket TK-${t.ticketNumber} aktualisiert`)
        }
        break
      }
      case 'ticket-deleted': {
        const { id } = msg.payload as { id: string }
        const idx = tickets.value.findIndex((x) => x.id === id)
        if (idx !== -1) {
          const t = tickets.value[idx]
          ui.addAiEvent(msg.type, `Ticket TK-${t?.ticketNumber} gelöscht`)
          tickets.value.splice(idx, 1)
        }
        break
      }
      case 'column-created': {
        const c = msg.payload as Column
        if (!columns.value.find((x) => x.id === c.id)) {
          columns.value.push(c)
          ui.addAiEvent(msg.type, `Spalte „${c.title}" erstellt`)
        }
        break
      }
      case 'column-updated': {
        const c = msg.payload as Column
        const idx = columns.value.findIndex((x) => x.id === c.id)
        if (idx !== -1) {
          columns.value[idx] = c
          ui.addAiEvent(msg.type, `Spalte „${c.title}" aktualisiert`)
        }
        break
      }
      case 'column-deleted': {
        const { id } = msg.payload as { id: string }
        const col = columns.value.find((x) => x.id === id)
        columns.value = columns.value.filter((x) => x.id !== id)
        tickets.value = tickets.value.filter((x) => x.columnId !== id)
        ui.addAiEvent(msg.type, `Spalte „${col?.title ?? id}" gelöscht`)
        break
      }
      case 'board-meta-updated': {
        board.value = { ...board.value, ...(msg.payload as Partial<Board>) }
        break
      }
    }
  }

  // ─── Initial load ──────────────────────────────────────────────────────
  async function fetchBoard() {
    loading.value = true
    try {
      const res = await fetch(`${API}/api/board`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: KanbanFile = await res.json()
      board.value = data.board
      columns.value = data.columns
      tickets.value = data.tickets
    } catch (err) {
      ui.toast('Fehler beim Laden des Boards', 'error')
      console.error('[Board] Fetch fehler:', err)
    } finally {
      loading.value = false
    }
    connectWebSocket()
  }

  // ─── Computed ──────────────────────────────────────────────────────────
  const sortedColumns = computed(() => [...columns.value].sort((a, b) => a.order - b.order))

  function getColumnTickets(columnId: string): Ticket[] {
    return [...tickets.value]
      .filter((t) => t.columnId === columnId)
      .sort((a, b) => a.order - b.order)
  }

  const allLabels = computed(() => {
    const set = new Set<string>()
    tickets.value.forEach((t) => t.labels.forEach((l) => set.add(l)))
    return [...set].sort()
  })

  const stats = computed(() => {
    const byColumn: Record<string, number> = {}
    const byPriority: Record<Priority, number> = { urgent: 0, high: 0, medium: 0, low: 0 }
    tickets.value.forEach((t) => {
      byColumn[t.columnId] = (byColumn[t.columnId] ?? 0) + 1
      byPriority[t.priority] = (byPriority[t.priority] ?? 0) + 1
    })
    return { byColumn, byPriority, total: tickets.value.length }
  })

  // ─── Ticket actions ────────────────────────────────────────────────────
  async function createTicket(payload: {
    columnId: string
    title: string
    description?: string
    priority?: Priority
    labels?: string[]
  }) {
    const existingNums = tickets.value.map((t) => t.ticketNumber)
    const ticket: Ticket = {
      id: generateId(),
      columnId: payload.columnId,
      ticketNumber: generateTicketNumber(existingNums),
      title: payload.title,
      description: payload.description ?? '',
      priority: payload.priority ?? 'medium',
      labels: payload.labels ?? [],
      order: tickets.value.filter((t) => t.columnId === payload.columnId).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    tickets.value.push(ticket)
    try {
      await fetch(`${API}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket),
      })
      ui.toast(`Ticket TK-${ticket.ticketNumber} erstellt`, 'success')
    } catch {
      tickets.value = tickets.value.filter((t) => t.id !== ticket.id)
      ui.toast('Fehler beim Erstellen des Tickets', 'error')
    }
    return ticket
  }

  async function updateTicket(id: string, patch: Partial<Omit<Ticket, 'id'>>) {
    const idx = tickets.value.findIndex((t) => t.id === id)
    if (idx === -1) return
    const current = tickets.value[idx] as Ticket
    const prev = { ...current }
    tickets.value[idx] = { ...current, ...patch, updatedAt: new Date().toISOString() } as Ticket
    try {
      await fetch(`${API}/api/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      ui.toast('Ticket aktualisiert', 'success')
    } catch {
      tickets.value[idx] = prev as Ticket
      ui.toast('Fehler beim Aktualisieren', 'error')
    }
  }

  async function deleteTicket(id: string) {
    const idx = tickets.value.findIndex((t) => t.id === id)
    if (idx === -1) return
    const removed = tickets.value[idx] as Ticket
    tickets.value.splice(idx, 1)
    try {
      await fetch(`${API}/api/tickets/${id}`, { method: 'DELETE' })
      ui.toast(`Ticket TK-${removed.ticketNumber} gelöscht`, 'info')
    } catch {
      tickets.value.splice(idx, 0, removed)
      ui.toast('Fehler beim Löschen', 'error')
    }
  }

  async function moveTickets(updates: { id: string; columnId: string; order: number }[]) {
    updates.forEach((u) => {
      const t = tickets.value.find((x) => x.id === u.id)
      if (t) {
        t.columnId = u.columnId
        t.order = u.order
      }
    })
    try {
      await fetch(`${API}/api/tickets/order`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
    } catch {
      ui.toast('Fehler beim Verschieben', 'error')
      await fetchBoard()
    }
  }

  // ─── Column actions ────────────────────────────────────────────────────
  async function createColumn(payload: { title: string; color?: string }) {
    const column: Column = {
      id: generateId(),
      title: payload.title,
      color: payload.color ?? '#6366f1',
      order: columns.value.length,
    }
    columns.value.push(column)
    try {
      await fetch(`${API}/api/columns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(column),
      })
      ui.toast(`Spalte „${column.title}" erstellt`, 'success')
    } catch {
      columns.value = columns.value.filter((c) => c.id !== column.id)
      ui.toast('Fehler beim Erstellen der Spalte', 'error')
    }
    return column
  }

  async function updateColumn(id: string, patch: Partial<Omit<Column, 'id'>>) {
    const idx = columns.value.findIndex((c) => c.id === id)
    if (idx === -1) return
    const currentCol = columns.value[idx] as Column
    const prev = { ...currentCol }
    columns.value[idx] = { ...currentCol, ...patch } as Column
    try {
      await fetch(`${API}/api/columns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      ui.toast('Spalte aktualisiert', 'success')
    } catch {
      columns.value[idx] = prev as Column
      ui.toast('Fehler beim Aktualisieren', 'error')
    }
  }

  async function deleteColumn(id: string) {
    const idx = columns.value.findIndex((c) => c.id === id)
    if (idx === -1) return
    const removed = columns.value[idx] as Column
    columns.value.splice(idx, 1)
    tickets.value = tickets.value.filter((t) => t.columnId !== id)
    try {
      await fetch(`${API}/api/columns/${id}`, { method: 'DELETE' })
      ui.toast(`Spalte „${removed.title}" gelöscht`, 'info')
    } catch {
      columns.value.splice(idx, 0, removed)
      ui.toast('Fehler beim Löschen der Spalte', 'error')
      await fetchBoard()
    }
  }

  async function reorderColumns(ordered: Column[]) {
    const updates = ordered.map((c, i) => ({ id: c.id, order: i }))
    ordered.forEach((c, i) => {
      const col = columns.value.find((x) => x.id === c.id)
      if (col) col.order = i
    })
    try {
      await fetch(`${API}/api/columns/order`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
    } catch {
      ui.toast('Fehler beim Sortieren der Spalten', 'error')
      await fetchBoard()
    }
  }

  async function updateBoardName(name: string) {
    const prev = board.value.name
    board.value = { ...board.value, name }
    try {
      await fetch(`${API}/api/board/meta`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
    } catch {
      board.value = { ...board.value, name: prev }
      ui.toast('Fehler beim Umbenennen', 'error')
    }
  }

  return {
    board,
    columns,
    tickets,
    loading,
    wsConnected,
    sortedColumns,
    getColumnTickets,
    allLabels,
    stats,
    fetchBoard,
    connectWebSocket,
    createTicket,
    updateTicket,
    deleteTicket,
    moveTickets,
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    updateBoardName,
  }
})
