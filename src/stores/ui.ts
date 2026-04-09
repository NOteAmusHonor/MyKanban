import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type {
  Toast,
  ModalType,
  TicketModalData,
  ColumnModalData,
  AiEvent,
  WsEventType,
} from '@/types'
import { generateId } from '@/utils/helpers'

export const useUiStore = defineStore('ui', () => {
  // ─── Theme ─────────────────────────────────────────────────────────────
  const isDark = ref(localStorage.getItem('mykanban-theme') !== 'light')

  watch(
    isDark,
    (dark) => {
      document.documentElement.classList.toggle('dark', dark)
      document.documentElement.classList.toggle('light', !dark)
      localStorage.setItem('mykanban-theme', dark ? 'dark' : 'light')
    },
    { immediate: true },
  )

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  // ─── Modal ─────────────────────────────────────────────────────────────
  const activeModal = ref<ModalType>(null)
  const ticketModalData = ref<TicketModalData | null>(null)
  const columnModalData = ref<ColumnModalData | null>(null)

  function openTicketCreate(columnId: string) {
    ticketModalData.value = { mode: 'create', columnId }
    activeModal.value = 'ticket-create'
  }

  function openTicketEdit(ticket: TicketModalData['ticket']) {
    ticketModalData.value = { mode: 'edit', ticket }
    activeModal.value = 'ticket-edit'
  }

  function openColumnCreate() {
    columnModalData.value = { mode: 'create' }
    activeModal.value = 'column-create'
  }

  function openColumnEdit(column: ColumnModalData['column']) {
    columnModalData.value = { mode: 'edit', column }
    activeModal.value = 'column-edit'
  }

  function openStats() {
    activeModal.value = 'stats'
  }

  function openAiPanel() {
    activeModal.value = 'ai'
  }

  function closeModal() {
    activeModal.value = null
    ticketModalData.value = null
    columnModalData.value = null
  }

  // ─── Toasts ────────────────────────────────────────────────────────────
  const toasts = ref<Toast[]>([])

  function toast(message: string, type: Toast['type'] = 'info', duration = 3500) {
    const id = generateId()
    toasts.value.push({ id, message, type, duration })
    setTimeout(() => removeToast(id), duration + 400)
  }

  function removeToast(id: string) {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) {
      toasts.value[idx]!.leaving = true
      setTimeout(() => {
        toasts.value = toasts.value.filter((t) => t.id !== id)
      }, 400)
    }
  }

  // ─── Filter state ───────────────────────────────────────────────────────
  const searchQuery = ref('')
  const filterPriorities = ref<string[]>([])
  const filterLabels = ref<string[]>([])

  function clearFilters() {
    searchQuery.value = ''
    filterPriorities.value = []
    filterLabels.value = []
  }

  const hasActiveFilters = () =>
    searchQuery.value !== '' || filterPriorities.value.length > 0 || filterLabels.value.length > 0

  // ─── AI Events (from WebSocket external changes) ────────────────────────
  const aiEvents = ref<AiEvent[]>([])

  const wsEventLabels: Record<WsEventType, string> = {
    'board-updated': 'Board synchronisiert',
    'ticket-created': 'Ticket erstellt',
    'ticket-updated': 'Ticket aktualisiert',
    'ticket-deleted': 'Ticket gelöscht',
    'column-created': 'Spalte erstellt',
    'column-updated': 'Spalte aktualisiert',
    'column-deleted': 'Spalte gelöscht',
    'board-meta-updated': 'Board umbenannt',
  }

  function addAiEvent(type: WsEventType, description: string) {
    aiEvents.value.unshift({
      type,
      description,
      timestamp: new Date().toISOString(),
    })
    if (aiEvents.value.length > 100) aiEvents.value.pop()
  }

  return {
    isDark,
    toggleTheme,
    activeModal,
    ticketModalData,
    columnModalData,
    openTicketCreate,
    openTicketEdit,
    openColumnCreate,
    openColumnEdit,
    openStats,
    openAiPanel,
    closeModal,
    toasts,
    toast,
    removeToast,
    searchQuery,
    filterPriorities,
    filterLabels,
    clearFilters,
    hasActiveFilters,
    aiEvents,
    addAiEvent,
    wsEventLabels,
  }
})
