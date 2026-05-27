<script setup lang="ts">
interface Props {
  variant?: 'default' | 'accent' | 'muted'
}
withDefaults(defineProps<Props>(), { variant: 'default' })
</script>

<template>
  <span :class="['eyebrow-pill', `eyebrow-pill--${variant}`]">
    <slot name="leading" />
    <span class="eyebrow-pill__text"><slot /></span>
  </span>
</template>

<style scoped>
.eyebrow-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 6px 12px;
  border-radius: var(--r-pill);
  font-family: var(--font-mono);
  font-size: var(--fs-eyebrow);
  letter-spacing: var(--ls-eyebrow);
  text-transform: uppercase;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  line-height: 1;
}

.eyebrow-pill--accent {
  color: var(--accent);
  border-color: rgba(124, 255, 203, 0.25);
  background: rgba(124, 255, 203, 0.06);
}

.eyebrow-pill--muted {
  background: transparent;
  border-color: var(--border);
}

.eyebrow-pill__text {
  display: inline-block;
}
</style>
