import type { Priority } from '@/types'

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36)
}

export function generateTicketNumber(existingNumbers: number[]): number {
  const used = new Set(existingNumbers)
  let num: number
  let attempts = 0
  do {
    num = Math.floor(Math.random() * 9000) + 1000 // 1000–9999
    attempts++
    if (attempts > 10000) break // safety
  } while (used.has(num))
  return num
}

export function formatTicketId(ticketNumber: number): string {
  return `TK-${ticketNumber}`
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateRelative(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  const diffH = Math.floor(diffMin / 60)
  const diffD = Math.floor(diffH / 24)

  if (diffMin < 1) return 'Gerade eben'
  if (diffMin < 60) return `vor ${diffMin} Min.`
  if (diffH < 24) return `vor ${diffH} Std.`
  if (diffD === 1) return 'Gestern'
  if (diffD < 7) return `vor ${diffD} Tagen`
  return formatDate(d)
}

export function priorityOrder(priority: Priority): number {
  const map: Record<Priority, number> = { urgent: 0, high: 1, medium: 2, low: 3 }
  return map[priority] ?? 4
}

export function priorityLabel(priority: Priority): string {
  const map: Record<Priority, string> = {
    urgent: 'Dringend',
    high: 'Hoch',
    medium: 'Mittel',
    low: 'Niedrig',
  }
  return map[priority] ?? priority
}

export function priorityColor(priority: Priority): string {
  const map: Record<Priority, string> = {
    urgent: '#ef4444',
    high: '#f97316',
    medium: '#3b82f6',
    low: '#22c55e',
  }
  return map[priority] ?? '#64748b'
}

export function priorityIcon(priority: Priority): string {
  const map: Record<Priority, string> = {
    urgent: '🔴',
    high: '🟠',
    medium: '🔵',
    low: '🟢',
  }
  return map[priority] ?? '⚪'
}

export function priorityBg(priority: Priority): string {
  const map: Record<Priority, string> = {
    urgent: 'rgba(239,68,68,0.15)',
    high: 'rgba(249,115,22,0.15)',
    medium: 'rgba(59,130,246,0.15)',
    low: 'rgba(34,197,94,0.15)',
  }
  return map[priority] ?? 'rgba(100,116,139,0.15)'
}

/** Returns a hex color string derived from a text string (for column color defaults) */
export function stringToColor(str: string): string {
  const presets = [
    '#6366f1',
    '#a855f7',
    '#f43f5e',
    '#f97316',
    '#f59e0b',
    '#10b981',
    '#14b8a6',
    '#06b6d4',
    '#0ea5e9',
    '#3b82f6',
    '#ec4899',
    '#64748b',
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return presets[Math.abs(hash) % presets.length] ?? '#6366f1'
}
