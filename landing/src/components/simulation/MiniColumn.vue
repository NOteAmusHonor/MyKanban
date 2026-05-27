<script setup lang="ts">
import { AnimatePresence } from 'motion-v'
import MiniTicket from './MiniTicket.vue'
import type { Ticket, ColumnId } from '@/data/aiScenario'
import type { PulsedTicket } from '@/composables/useAiScenario'

interface Props {
  id: ColumnId
  title: string
  tickets: Ticket[]
  pulsed: PulsedTicket | null
}
defineProps<Props>()
</script>

<template>
  <section :class="['column', `column--${id}`]" :aria-label="title">
    <header class="column__head">
      <span :class="['column__dot', `column__dot--${id}`]" aria-hidden="true" />
      <h3 class="column__title">{{ title }}</h3>
      <span class="column__count">{{ tickets.length }}</span>
    </header>

    <div class="column__body">
      <AnimatePresence>
        <MiniTicket
          v-for="t in tickets"
          :key="t.id"
          :ticket="t"
          :pulsed="pulsed"
        />
      </AnimatePresence>
      <div v-if="tickets.length === 0" class="column__empty" aria-hidden="true">leer</div>
    </div>
  </section>
</template>

<style scoped>
.column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 100%;
}

.column__head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.column__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-dim);
}
.column__dot--doing {
  background: var(--accent-secondary);
  box-shadow: 0 0 8px var(--accent-secondary-glow);
}
.column__dot--done {
  background: var(--success);
  box-shadow: 0 0 8px var(--success-glow);
}

.column__title {
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--text);
  text-transform: uppercase;
}

.column__count {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-muted);
  margin-left: auto;
  padding: 2px 8px;
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
}

.column__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 80px;
}

.column__empty {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-dim);
  text-align: center;
  padding: 24px 0;
  border: 1px dashed var(--border);
  border-radius: var(--r-md);
}
</style>
