# MyKanban — Copilot Instructions

## Architecture

MyKanban is a **local-first Kanban board** that ships as two things simultaneously:

1. **Standalone app** — `node bin/mykanban.mjs` starts an Express + WebSocket server that serves the built Vue SPA and persists data to `kanban.json` in the CWD of whoever runs it.
2. **npm library** — `src/index.ts` exports Vue components and stores so other projects can embed the board (`import { KanbanBoard } from '@mykanban/board'`).

### Data Flow

```
kanban.json (on disk)
  ↕  chokidar file watcher (detects external AI edits)
Express REST API (server/index.mjs)
  ↕  WebSocket broadcast
Pinia useBoardStore (src/stores/board.ts)
  ↕
Vue components
```

All mutations go optimistically through `useBoardStore` → REST → WebSocket broadcast back to all connected tabs. External writes (e.g., an AI editing `kanban.json` directly) are picked up by chokidar and broadcast as `board-updated`.

### Ports

| Environment | Vite frontend | Express/WS server |
|---|---|---|
| Dev | `5173` | `3000` |
| Production | — | `3737` (env: `MYKANBAN_PORT`) |

In dev, Vite proxies `/api` → `localhost:3000` (see `vite.config.ts`).

## Dev Commands

```bash
# Development (two terminals required)
node server/index.mjs   # Terminal 1: API + WebSocket server
npm run dev             # Terminal 2: Vite dev server with HMR → http://localhost:5173

# Build app (type-check + Vite build)
npm run build

# Build as npm library (externalizes vue/pinia/vue-router)
npm run build:library   # env BUILD=library

# Type-check only
npm run type-check

# Format
npm run format          # prettier --write src/
```

No test suite exists in this project.

## Key Conventions

### Vue Components
- Always `<script setup lang="ts">` — no Options API
- Props typed via `defineProps<{ ... }>()`
- `@` alias maps to `src/`

### Pinia Stores
- Composition-style stores only (not Options stores)
- Two stores: `useBoardStore` (board data + API calls) and `useUiStore` (modals, toasts, filters, theme)
- `useUiStore` must not import from `useBoardStore`; `useBoardStore` calls `ui.toast()` for user feedback

### Server (server/index.mjs)
- Written in plain JS with `// @ts-nocheck` — not TypeScript
- All write operations use `withSuppressedWatcher()` to prevent the file watcher from re-broadcasting changes the server itself just made
- Broadcasts WebSocket events matching `WsEventType` from `src/types/index.ts`

### kanban.json Schema
- Defined in `kanban.schema.json` — AIs should follow this schema when editing the file directly
- `ticketNumber` is a random 4-digit integer (1000–9999), displayed as `TK-XXXX`
- `order` fields are 0-based integers; columns and tickets within a column are sorted by `order`
- Ticket `description` is Markdown

### Library Exports
- All public exports go through `src/index.ts`
- When adding new public components/composables, add them to `src/index.ts`
- Library build externalizes `vue`, `pinia`, `vue-router` (peer dependencies)
