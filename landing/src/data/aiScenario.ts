/**
 * Live-AI-Simulation: deklaratives Szenario.
 * Jeder Schritt mappt 1:1 auf eine sichtbare Aktion in Terminal + MiniBoard.
 */

export type ColumnId = 'todo' | 'doing' | 'done'

export interface Ticket {
  id: string
  title: string
  column: ColumnId
  labels: string[]
  priority?: 'low' | 'med' | 'high'
}

/** Initial-Board, mit dem die Simulation startet. */
export const initialTickets: Ticket[] = [
  {
    id: 'MK-031',
    title: 'WebSocket-Reconnect bei Server-Restart',
    column: 'doing',
    labels: ['backend'],
  },
  {
    id: 'MK-028',
    title: 'kanban.json Schema-Validation',
    column: 'doing',
    labels: ['core'],
  },
  {
    id: 'MK-024',
    title: 'Drag & Drop für Touch-Devices',
    column: 'done',
    labels: ['ui'],
  },
]

export type Step =
  | { kind: 'log'; text: string; delayAfter?: number }
  | {
      kind: 'create'
      ticket: Ticket
      callPreview: string
      okText: string
      delayAfter?: number
    }
  | {
      kind: 'update'
      id: string
      toColumn: ColumnId
      callPreview: string
      okText: string
      delayAfter?: number
    }
  | {
      kind: 'complete'
      id: string
      callPreview: string
      okText: string
      delayAfter?: number
    }
  | { kind: 'pause'; ms: number }

export const scenario: Step[] = [
  {
    kind: 'log',
    text: '> analysiere kanban.json …',
    delayAfter: 600,
  },
  {
    kind: 'log',
    text: '> 3 offene Tickets in "Doing" gefunden',
    delayAfter: 800,
  },
  {
    kind: 'create',
    ticket: {
      id: 'MK-042',
      title: 'Refactor: Auth-Middleware extrahieren',
      column: 'todo',
      labels: ['backend', 'tech-debt'],
      priority: 'high',
    },
    callPreview:
      '→ tools.create_ticket({\n    title: "Refactor: Auth-Middleware extrahieren",\n    column: "todo",\n    priority: "high",\n    labels: ["backend", "tech-debt"]\n  })',
    okText: '  ✓ erstellt MK-042',
    delayAfter: 1100,
  },
  {
    kind: 'update',
    id: 'MK-028',
    toColumn: 'done',
    callPreview:
      '→ tools.update_ticket({\n    id: "MK-028",\n    column: "done",\n    note: "Schema deckt alle Edge-Cases"\n  })',
    okText: '  ✓ verschoben → Done',
    delayAfter: 900,
  },
  {
    kind: 'complete',
    id: 'MK-031',
    callPreview:
      '→ tools.complete_ticket({\n    id: "MK-031",\n    note: "Verifiziert lokal, kein Regression"\n  })',
    okText: '  ✓ abgeschlossen',
    delayAfter: 1400,
  },
  {
    kind: 'create',
    ticket: {
      id: 'MK-043',
      title: 'README: KI-Workflow dokumentieren',
      column: 'todo',
      labels: ['docs'],
    },
    callPreview:
      '→ tools.create_ticket({\n    title: "README: KI-Workflow dokumentieren",\n    column: "todo",\n    labels: ["docs"]\n  })',
    okText: '  ✓ erstellt MK-043',
    delayAfter: 1000,
  },
  {
    kind: 'update',
    id: 'MK-042',
    toColumn: 'doing',
    callPreview:
      '→ tools.update_ticket({\n    id: "MK-042",\n    column: "doing"\n  })',
    okText: '  ✓ verschoben → Doing',
    delayAfter: 1200,
  },
  {
    kind: 'log',
    text: '> Iteration abgeschlossen · 4 Aktionen · 0 Cloud-Calls',
    delayAfter: 2200,
  },
  { kind: 'pause', ms: 600 },
]
