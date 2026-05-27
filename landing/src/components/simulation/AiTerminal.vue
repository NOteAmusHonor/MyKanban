<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { TerminalLine } from '@/composables/useAiScenario'

interface Props {
  lines: TerminalLine[]
  running: boolean
}
const props = defineProps<Props>()

const scrollerRef = ref<HTMLElement | null>(null)

watch(
  () => props.lines.length,
  async () => {
    await nextTick()
    if (scrollerRef.value) {
      scrollerRef.value.scrollTop = scrollerRef.value.scrollHeight
    }
  },
)
</script>

<template>
  <section class="terminal" aria-label="AI-Aktivität">
    <header class="terminal__head">
      <span class="terminal__dots" aria-hidden="true"><i /><i /><i /></span>
      <span class="terminal__title">claude-3.5-sonnet · mykanban-agent</span>
      <span class="terminal__live">
        <span class="terminal__pulse" aria-hidden="true" />
        live
      </span>
    </header>

    <div ref="scrollerRef" class="terminal__body" role="log" aria-live="polite">
      <div v-for="(line, i) in lines" :key="i" :class="['line', `line--${line.kind}`]">
        <template v-if="line.kind === 'log'">
          <span class="line__text">{{ line.text }}</span>
        </template>
        <template v-else-if="line.kind === 'ok'">
          <span class="line__text">{{ line.text }}</span>
        </template>
        <template v-else-if="line.kind === 'call'">
          <pre class="line__pre" :class="`line__pre--${line.tone}`">{{ line.text }}</pre>
        </template>
        <template v-else-if="line.kind === 'typing'">
          <pre v-if="line.tone !== 'log'" class="line__pre" :class="`line__pre--${line.tone}`">{{ line.text }}<span class="line__cursor" aria-hidden="true">▍</span></pre>
          <span v-else class="line__text">{{ line.text }}<span class="line__cursor" aria-hidden="true">▍</span></span>
        </template>
      </div>
      <div v-if="lines.length === 0" class="terminal__idle">> bereit · warte auf Trigger …</div>
    </div>
  </section>
</template>

<style scoped>
.terminal {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  overflow: hidden;
  min-height: 460px;
  box-shadow: var(--shadow-card);
  font-family: var(--font-mono);
}

.terminal__head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-elev);
}

.terminal__dots {
  display: inline-flex;
  gap: 6px;
}
.terminal__dots i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border-strong);
  display: block;
}

.terminal__title {
  font-size: 0.8125rem;
  color: var(--text);
  letter-spacing: 0.01em;
}

.terminal__live {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.6875rem;
  color: var(--accent);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.terminal__pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent-glow-strong);
  animation: livePulse 1.6s var(--ease-in-out-calm) infinite;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}

.terminal__body {
  flex: 1;
  padding: 20px 22px;
  overflow-y: auto;
  font-size: 0.8125rem;
  line-height: 1.65;
  color: var(--text);
  scroll-behavior: smooth;
}

.terminal__idle {
  color: var(--text-dim);
}

.line {
  margin-bottom: 4px;
}

.line__text {
  white-space: pre-wrap;
  word-break: break-word;
}

.line--log .line__text {
  color: var(--text-muted);
}

.line--ok .line__text {
  color: var(--success);
}

.line__pre {
  margin: 6px 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.6;
}

.line__pre--create { color: var(--accent); }
.line__pre--update { color: var(--accent-secondary); }
.line__pre--complete { color: var(--success); }

.line__cursor {
  display: inline-block;
  margin-left: 2px;
  color: var(--accent);
  animation: blink 900ms steps(2, end) infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  50.01%, 100% { opacity: 0.2; }
}

@media (prefers-reduced-motion: reduce) {
  .terminal__pulse,
  .line__cursor {
    animation: none !important;
  }
}
</style>
