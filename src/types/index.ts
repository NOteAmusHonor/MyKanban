// ============================================
// MYKANBAN — Types
// Local-first, JSON-file-backed Kanban Board
// ============================================

export interface Board {
  id: string
  name: string
}

export interface Column {
  id: string
  title: string
  order: number
  color: string
  wipLimit?: number
}

export interface Ticket {
  id: string
  columnId: string
  ticketNumber: number
  title: string
  description: string
  priority: Priority
  labels: string[]
  order: number
  createdAt: string
  updatedAt: string
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface KanbanMeta {
  version: string
  createdAt: string
  lastModified: string
}

/** Root structure of kanban.json */
export interface KanbanFile {
  meta: KanbanMeta
  board: Board
  columns: Column[]
  tickets: Ticket[]
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  leaving?: boolean
}

export type ModalType =
  | 'ticket-create'
  | 'ticket-edit'
  | 'column-create'
  | 'column-edit'
  | 'stats'
  | null

export interface TicketModalData {
  mode: 'create' | 'edit'
  ticket?: Ticket
  columnId?: string
}

export interface ColumnModalData {
  mode: 'create' | 'edit'
  column?: Column
}

export type WsEventType =
  | 'board-updated'
  | 'ticket-created'
  | 'ticket-updated'
  | 'ticket-deleted'
  | 'column-created'
  | 'column-updated'
  | 'column-deleted'
  | 'board-meta-updated'

export interface WsEvent {
  type: WsEventType
  payload: unknown
}

export interface FilterState {
  search: string
  priorities: Priority[]
  labels: string[]
}
