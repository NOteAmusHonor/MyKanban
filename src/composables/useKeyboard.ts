import { onMounted, onUnmounted } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useBoardStore } from '@/stores/board'

export function useKeyboard() {
  const ui = useUiStore()
  const board = useBoardStore()

  function onKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
    if (target.isContentEditable) return

    if (!e.ctrlKey && !e.metaKey) return

    switch (e.key.toLowerCase()) {
      case 'n':
        if (!ui.activeModal && board.sortedColumns.length > 0) {
          e.preventDefault()
          ui.openTicketCreate(board.sortedColumns[0]!.id)
        }
        break

      case 'd':
        if (!ui.activeModal) {
          e.preventDefault()
          ui.toggleTheme()
        }
        break

      case 's':
        if (!ui.activeModal) {
          e.preventDefault()
          ui.openStats()
        }
        break
    }

    if (e.key === 'Escape' && ui.activeModal) {
      e.preventDefault()
      ui.closeModal()
    }
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onUnmounted(() => window.removeEventListener('keydown', onKeydown))
}
