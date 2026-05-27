import { ref, shallowRef, computed, onBeforeUnmount } from 'vue'
import {
  initialTickets,
  scenario,
  type Step,
  type Ticket,
  type ColumnId,
} from '@/data/aiScenario'

export type TerminalLine =
  | { kind: 'log'; text: string }
  | { kind: 'call'; text: string; tone: 'create' | 'update' | 'complete' }
  | { kind: 'ok'; text: string }
  | { kind: 'typing'; text: string; tone: 'create' | 'update' | 'complete' | 'log' }

export interface PulsedTicket {
  id: string
  tone: 'create' | 'update' | 'complete'
}

interface EngineState {
  running: boolean
  reducedMotion: boolean
}

/**
 * Live-AI-Simulation Engine.
 * Deterministic, step-based. Pausable. Reduced-motion zeigt Endzustand statisch.
 */
export function useAiScenario(opts: { reducedMotion: () => boolean }) {
  const tickets = ref<Ticket[]>(structuredClone(initialTickets))
  const lines = ref<TerminalLine[]>([])
  const pulsed = shallowRef<PulsedTicket | null>(null)
  const state = ref<EngineState>({ running: false, reducedMotion: false })

  let stepIdx = 0
  let timer: ReturnType<typeof setTimeout> | null = null
  let typingTimer: ReturnType<typeof setTimeout> | null = null

  const clearTimers = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    if (typingTimer) {
      clearTimeout(typingTimer)
      typingTimer = null
    }
  }

  const reset = () => {
    clearTimers()
    tickets.value = structuredClone(initialTickets)
    lines.value = []
    pulsed.value = null
    stepIdx = 0
  }

  const pushLine = (line: TerminalLine) => {
    lines.value = [...lines.value, line]
    // cap to last 80 lines for perf
    if (lines.value.length > 80) lines.value = lines.value.slice(-80)
  }

  const typewriter = (
    text: string,
    tone: 'create' | 'update' | 'complete' | 'log',
    onDone: () => void,
  ) => {
    let i = 0
    const speed = 16 // ms per char
    const tick = () => {
      i = Math.min(text.length, i + 2)
      lines.value = [
        ...lines.value.slice(0, -1),
        { kind: 'typing', text: text.slice(0, i), tone },
      ]
      if (i < text.length) {
        typingTimer = setTimeout(tick, speed)
      } else {
        // finalize
        const final: TerminalLine =
          tone === 'log'
            ? { kind: 'log', text }
            : { kind: 'call', text, tone }
        lines.value = [...lines.value.slice(0, -1), final]
        onDone()
      }
    }
    // seed a typing line we then mutate
    pushLine({ kind: 'typing', text: '', tone })
    tick()
  }

  const applyTicketMove = (id: string, toColumn: ColumnId) => {
    tickets.value = tickets.value.map((t) =>
      t.id === id ? { ...t, column: toColumn } : t,
    )
  }

  const applyCreate = (t: Ticket) => {
    if (tickets.value.some((x) => x.id === t.id)) return
    tickets.value = [...tickets.value, t]
  }

  const pulse = (id: string, tone: 'create' | 'update' | 'complete') => {
    pulsed.value = { id, tone }
    setTimeout(() => {
      if (pulsed.value?.id === id) pulsed.value = null
    }, 1300)
  }

  const runStep = (step: Step) => {
    const after = (delay: number) => {
      timer = setTimeout(advance, delay)
    }

    switch (step.kind) {
      case 'log':
        typewriter(step.text, 'log', () => after(step.delayAfter ?? 500))
        break

      case 'create':
        typewriter(step.callPreview, 'create', () => {
          applyCreate(step.ticket)
          pulse(step.ticket.id, 'create')
          pushLine({ kind: 'ok', text: step.okText })
          after(step.delayAfter ?? 800)
        })
        break

      case 'update':
        typewriter(step.callPreview, 'update', () => {
          applyTicketMove(step.id, step.toColumn)
          pulse(step.id, 'update')
          pushLine({ kind: 'ok', text: step.okText })
          after(step.delayAfter ?? 800)
        })
        break

      case 'complete':
        typewriter(step.callPreview, 'complete', () => {
          applyTicketMove(step.id, 'done')
          pulse(step.id, 'complete')
          pushLine({ kind: 'ok', text: step.okText })
          after(step.delayAfter ?? 800)
        })
        break

      case 'pause':
        after(step.ms)
        break
    }
  }

  const advance = () => {
    if (!state.value.running) return
    if (stepIdx >= scenario.length) {
      // smooth restart
      timer = setTimeout(() => {
        reset()
        state.value.running = true
        advance()
      }, 1200)
      return
    }
    const step = scenario[stepIdx++]
    runStep(step)
  }

  const start = () => {
    if (state.value.running) return
    if (opts.reducedMotion()) {
      // Static end state
      renderStaticEndState()
      return
    }
    state.value.running = true
    if (lines.value.length === 0) advance()
    else advance()
  }

  const pause = () => {
    state.value.running = false
    clearTimers()
  }

  const renderStaticEndState = () => {
    reset()
    // apply all mutations without animation
    for (const step of scenario) {
      if (step.kind === 'create') applyCreate(step.ticket)
      else if (step.kind === 'update') applyTicketMove(step.id, step.toColumn)
      else if (step.kind === 'complete') applyTicketMove(step.id, 'done')
    }
    lines.value = [
      { kind: 'log', text: '> 4 Aktionen ausgeführt' },
      { kind: 'ok', text: '  ✓ MK-042 erstellt' },
      { kind: 'ok', text: '  ✓ MK-028 → Done' },
      { kind: 'ok', text: '  ✓ MK-031 abgeschlossen' },
      { kind: 'ok', text: '  ✓ MK-043 erstellt' },
      { kind: 'log', text: '> 0 Cloud-Calls · 0 ms Latenz' },
    ]
  }

  const ticketsByColumn = computed(() => {
    const map: Record<ColumnId, Ticket[]> = { todo: [], doing: [], done: [] }
    for (const t of tickets.value) map[t.column].push(t)
    return map
  })

  onBeforeUnmount(() => {
    clearTimers()
  })

  return {
    tickets,
    ticketsByColumn,
    lines,
    pulsed,
    state,
    start,
    pause,
    reset,
  }
}
