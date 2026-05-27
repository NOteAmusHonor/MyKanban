<template>
  <RouterView />
  <Toast />

  <!-- Keyboard shortcuts hint (bottom right, on hover) -->
  <div class="shortcuts-hint" aria-hidden="true">
    <div class="shortcuts-list">
      <p class="shortcuts-title">Tastenkürzel</p>
      <div class="shortcuts-rows">
        <span class="shortcut-row"><span class="shortcut-keys"><kbd>Ctrl</kbd><kbd>N</kbd></span><span class="shortcut-desc">Neues Ticket</span></span>
        <span class="shortcut-row"><span class="shortcut-keys"><kbd>Ctrl</kbd><kbd>C</kbd></span><span class="shortcut-desc">Neue Spalte</span></span>
        <span class="shortcut-row"><span class="shortcut-keys"><kbd>Ctrl</kbd><kbd>D</kbd></span><span class="shortcut-desc">Dark / Light</span></span>
        <span class="shortcut-row"><span class="shortcut-keys"><kbd>Ctrl</kbd><kbd>S</kbd></span><span class="shortcut-desc">Statistiken</span></span>
        <span class="shortcut-row"><span class="shortcut-keys"><kbd>Esc</kbd></span><span class="shortcut-desc">Schließen</span></span>
      </div>
      <p class="shortcuts-hint-tip">Hover über dieses Symbol zum Anzeigen</p>
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

.shortcuts-list {
  background: var(--material-thick);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 0.875rem 1rem;
  opacity: 0;
  transform: translateX(6px) translateY(4px);
  transition: all var(--transition-base);
  pointer-events: none;
  margin-right: 0.5rem;
  box-shadow: var(--shadow-md);
  min-width: 200px;
}

.shortcuts-hint:has(.shortcuts-trigger:hover) .shortcuts-list {
  opacity: 1;
  transform: translateX(0) translateY(0);
}

.shortcuts-trigger:hover {
  color: var(--text-primary);
}

.shortcuts-title {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  margin-bottom: 0.5rem;
}

.shortcuts-rows {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.shortcut-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.shortcut-keys {
  display: flex;
  gap: 3px;
  flex-shrink: 0;
}

.shortcut-desc {
  color: var(--text-tertiary);
  text-align: right;
}

.shortcuts-hint-tip {
  margin-top: 0.625rem;
  font-size: 0.68rem;
  color: var(--text-muted);
  border-top: 1px solid var(--separator);
  padding-top: 0.5rem;
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
