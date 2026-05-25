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
    <span class="shortcuts-trigger">
      <Icon name="keyboard" :size="14" />
    </span>
  </div>
</template>

<script setup lang="ts">
import Toast from '@/components/ui/Toast.vue'
import Icon from '@/components/ui/Icon.vue'
import { useKeyboard } from '@/composables/useKeyboard'

useKeyboard()
</script>

<style>
/* Apple-inspired design system */
@import '@/assets/main.css';
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
  width: 30px;
  height: 30px;
  border-radius: var(--radius-full);
  background: var(--material-thick);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  color: var(--text-tertiary);
  box-shadow: var(--shadow-sm);
  transition: color var(--transition-fast);
}

.shortcuts-hint:hover .shortcuts-trigger {
  color: var(--text-primary);
}

.shortcuts-list {
  display: flex;
  gap: 0.875rem;
  background: var(--material-thick);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
  color: var(--text-secondary);
  opacity: 0;
  transform: translateX(6px);
  transition: all var(--transition-base);
  pointer-events: none;
  margin-right: 0.5rem;
  white-space: nowrap;
  box-shadow: var(--shadow-md);
}

.shortcuts-hint:hover .shortcuts-list {
  opacity: 1;
  transform: translateX(0);
}

kbd {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 5px;
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-right: 3px;
}
</style>
