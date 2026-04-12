<template>
  <RouterView />
  <Toast />

  <!-- Keyboard shortcuts hint (bottom right, on hover) -->
  <div class="shortcuts-hint" aria-hidden="true">
    <div class="shortcuts-list">
      <span><kbd>N</kbd> Ticket</span>
      <span><kbd>D</kbd> Theme</span>
      <span><kbd>S</kbd> Stats</span>
      <span><kbd>/</kbd> KI</span>
      <span><kbd>Esc</kbd> Schließen</span>
    </div>
    <span class="shortcuts-trigger">⌨</span>
  </div>
</template>

<script setup lang="ts">
import Toast from '@/components/ui/Toast.vue'
import { useKeyboard } from '@/composables/useKeyboard'
import { useUiStore } from '@/stores/ui'

useKeyboard()
const ui = useUiStore()
</script>

<style>
/* Import global design system */
@import '@/assets/main.css';

/* Import Inter font from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
</style>

<style scoped>
/* Keyboard shortcuts floating hint */
.shortcuts-hint {
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  z-index: 500;
  display: flex;
  align-items: flex-end;
  gap: 0;
}

.shortcuts-trigger {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  cursor: default;
  color: var(--text-muted);
  transition: all var(--transition-fast);
}

.shortcuts-list {
  display: flex;
  gap: 0.75rem;
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 0.5rem 0.875rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  opacity: 0;
  transform: translateX(8px);
  transition: all var(--transition-base);
  pointer-events: none;
  backdrop-filter: blur(12px);
  margin-right: 0.5rem;
  white-space: nowrap;
}

.shortcuts-hint:hover .shortcuts-list {
  opacity: 1;
  transform: translateX(0);
}

kbd {
  display: inline-block;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--surface);
  border: 1px solid var(--border-hover);
  font-family: 'SF Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-accent);
  margin-right: 3px;
}
</style>
