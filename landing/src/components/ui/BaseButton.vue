<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'ghost'
  href?: string
  size?: 'md' | 'lg'
}
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
})

const tag = props.href ? 'a' : 'button'
</script>

<template>
  <component
    :is="tag"
    :href="href"
    :class="['btn', `btn--${variant}`, `btn--${size}`]"
    :target="href?.startsWith('http') ? '_blank' : undefined"
    :rel="href?.startsWith('http') ? 'noopener noreferrer' : undefined"
  >
    <span class="btn__label">
      <slot />
    </span>
    <span class="btn__arrow" aria-hidden="true">→</span>
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-sans);
  font-weight: 500;
  letter-spacing: -0.005em;
  border-radius: var(--r-pill);
  cursor: pointer;
  text-decoration: none;
  position: relative;
  isolation: isolate;
  transition:
    color var(--d-micro) var(--ease-out-soft),
    background-color var(--d-micro) var(--ease-out-soft),
    box-shadow var(--d-short) var(--ease-out-soft),
    border-color var(--d-micro) var(--ease-out-soft),
    transform var(--d-short) var(--ease-out-soft);
}

.btn--md {
  padding: 10px 18px;
  font-size: 0.9375rem;
}

.btn--lg {
  padding: 14px 26px;
  font-size: 1rem;
}

.btn__arrow {
  display: inline-block;
  transition: transform var(--d-short) var(--ease-out-snap);
}

.btn:hover .btn__arrow {
  transform: translateX(3px);
}

/* Primary: Mint outline + glow */
.btn--primary {
  background: transparent;
  color: var(--accent);
  border: 1px solid var(--accent);
  box-shadow:
    0 0 0 1px transparent,
    0 0 0 0 var(--accent-glow);
}

.btn--primary:hover {
  background: var(--accent);
  color: var(--bg);
  box-shadow: 0 0 32px var(--accent-glow-strong);
}

.btn--primary:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 3px var(--bg),
    0 0 0 5px var(--accent),
    0 0 32px var(--accent-glow-strong);
}

/* Ghost: text-only */
.btn--ghost {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid transparent;
  padding-inline: 10px;
}

.btn--ghost:hover {
  color: var(--text);
}
</style>
