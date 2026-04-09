import { onMounted, onUnmounted } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useBoardStore } from '@/stores/board'

export function useKeyboard() {
  const ui = useUiStore()
  const board = useBoardStore()

  function onKeydown(e: KeyboardEvent) {
    // Don't trigger shortcuts when typing in inputs
    const target = e.target as HTMLElement
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
    if (target.isContentEditable) return

    switch (e.key.toLowerCase()) {
      case 'n':
        // New ticket — open in first column if available
        if (!ui.activeModal && board.sortedColumns.length > 0) {
          e.preventDefault()
          ui.openTicketCreate(board.sortedColumns[0]!.id)
        }
        break

      case 'c':
        // New column
        if (!ui.activeModal) {
          e.preventDefault()
          ui.openColumnCreate()
        }
        break

      case 'd':
        // Toggle dark/light mode
        if (!ui.activeModal) {
          e.preventDefault()
          ui.toggleTheme()
        }
        break

      case 's':
        // Statistics
        if (!ui.activeModal) {
          e.preventDefault()
          ui.openStats()
        }
        break

      case '/':
        // AI Panel
        if (!ui.activeModal) {
          e.preventDefault()
          ui.openAiPanel()
        }
        break

      case 'escape':
        // Close any open modal
        if (ui.activeModal) {
          e.preventDefault()
          ui.closeModal()
        }
        break
    }
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onUnmounted(() => window.removeEventListener('keydown', onKeydown))
}
