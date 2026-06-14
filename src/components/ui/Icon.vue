<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    class="icon"
    v-html="path"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  size?: number | string
  strokeWidth?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  size: 18,
  strokeWidth: 1.7,
})

// SF-Symbols-inspired line icons. Compact & consistent.
const ICONS: Record<string, string> = {
  search:
    '<circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />',
  plus:
    '<path d="M12 5v14M5 12h14" />',
  close:
    '<path d="M6 6l12 12M6 18L18 6" />',
  sun:
    '<circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />',
  moon:
    '<path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />',
  chart:
    '<path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-6" />',
  sparkles:
    '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" /><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z" />',
  more:
    '<circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.2" fill="currentColor" stroke="none" />',
  columns:
    '<rect x="3" y="4" width="6" height="16" rx="2" /><rect x="15" y="4" width="6" height="10" rx="2" />',
  filter:
    '<path d="M4 5h16M7 12h10M10 19h4" />',
  trash:
    '<path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />',
  edit:
    '<path d="M4 20h4l11-11a2.83 2.83 0 0 0-4-4L4 16v4z" /><path d="M13.5 6.5l4 4" />',
  eye:
    '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" />',
  check:
    '<path d="M5 12l5 5L20 7" />',
  alert:
    '<path d="M12 9v4M12 17h.01" /><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />',
  info:
    '<circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />',
  keyboard:
    '<rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12" />',
  bolt:
    '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />',
  squircle:
    '<rect x="3" y="3" width="18" height="18" rx="6" />',
  dot:
    '<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />',
  arrowRight:
    '<path d="M5 12h14M13 6l6 6-6 6" />',
  lock:
    '<rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />',
}

const path = computed(() => ICONS[props.name] ?? '')
</script>

<style scoped>
.icon {
  display: inline-block;
  flex-shrink: 0;
  vertical-align: middle;
}
</style>
