<script setup lang="ts">
import { LayoutGroup } from 'motion-v'
import MiniColumn from './MiniColumn.vue'
import type { Ticket, ColumnId } from '@/data/aiScenario'
import type { PulsedTicket } from '@/composables/useAiScenario'

interface Props {
  ticketsByColumn: Record<ColumnId, Ticket[]>
  pulsed: PulsedTicket | null
}
defineProps<Props>()
</script>

<template>
  <div class="mini-board" aria-label="Live-Vorschau des Boards">
    <LayoutGroup>
      <MiniColumn id="todo" title="Todo" :tickets="ticketsByColumn.todo" :pulsed="pulsed" />
      <MiniColumn id="doing" title="Doing" :tickets="ticketsByColumn.doing" :pulsed="pulsed" />
      <MiniColumn id="done" title="Done" :tickets="ticketsByColumn.done" :pulsed="pulsed" />
    </LayoutGroup>
  </div>
</template>

<style scoped>
.mini-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 28px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  min-height: 460px;
  box-shadow: var(--shadow-card);
}

@media (max-width: 640px) {
  .mini-board {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 20px;
  }
}
</style>
