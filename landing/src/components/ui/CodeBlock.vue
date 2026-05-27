<script setup lang="ts">
interface Props {
  language?: string
  filename?: string
}
withDefaults(defineProps<Props>(), { language: 'json' })
</script>

<template>
  <figure class="code-block">
    <header v-if="filename" class="code-block__header">
      <span class="code-block__dots" aria-hidden="true">
        <i></i><i></i><i></i>
      </span>
      <span class="code-block__filename">{{ filename }}</span>
      <span class="code-block__lang">{{ language }}</span>
    </header>
    <pre class="code-block__pre"><code><slot /></code></pre>
  </figure>
</template>

<style scoped>
.code-block {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  font-family: var(--font-mono);
  box-shadow: var(--shadow-card);
}

.code-block__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-elev);
}

.code-block__dots {
  display: inline-flex;
  gap: 6px;
}
.code-block__dots i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border-strong);
  display: block;
}

.code-block__filename {
  color: var(--text);
  font-size: 0.8125rem;
}

.code-block__lang {
  margin-left: auto;
  color: var(--text-muted);
  font-size: 0.6875rem;
  letter-spacing: var(--ls-eyebrow);
  text-transform: uppercase;
}

.code-block__pre {
  margin: 0;
  padding: 20px 22px;
  font-size: 0.8125rem;
  line-height: 1.65;
  overflow-x: auto;
  color: var(--text);
}

/* Tokens used by callers via classes */
.code-block :deep(.tok-key) {
  color: var(--text);
}
.code-block :deep(.tok-str) {
  color: var(--accent-secondary);
}
.code-block :deep(.tok-num) {
  color: var(--accent);
}
.code-block :deep(.tok-com) {
  color: var(--text-dim);
  font-style: italic;
}
.code-block :deep(.tok-fn) {
  color: var(--accent);
}
.code-block :deep(.tok-ok) {
  color: var(--success);
}
</style>
