<script setup lang="ts">
import { motion } from 'motion-v'
import type { PulsedTicket } from '@/composables/useAiScenario'
import type { Ticket } from '@/data/aiScenario'

interface Props {
  ticket: Ticket
  pulsed: PulsedTicket | null
}
const props = defineProps<Props>()

const isPulsed = () => props.pulsed?.id === props.ticket.id
const pulseTone = () => props.pulsed?.tone
</script>

<template>
  <motion.article
    layout
    :transition="{
      layout: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    }"
    :initial="{ opacity: 0, scale: 0.92 }"
    :animate="{ opacity: 1, scale: 1 }"
    :exit="{ opacity: 0, scale: 0.92 }"
    :class="[
      'ticket',
      isPulsed() && `ticket--pulse-${pulseTone()}`,
      ticket.column === 'done' && 'ticket--done',
    ]"
  >
    <header class="ticket__head">
      <span class="ticket__id">{{ ticket.id }}</span>
      <span v-if="ticket.priority === 'high'" class="ticket__prio">high</span>
    </header>
    <h4 class="ticket__title">{{ ticket.title }}</h4>
    <ul v-if="ticket.labels.length" class="ticket__labels">
      <li v-for="l in ticket.labels" :key="l" class="ticket__label">{{ l }}</li>
    </ul>
  </motion.article>
</template>

<style scoped>
.ticket {
  position: relative;
  padding: 12px 14px;
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  display: flex;
  flex-direction: column;
  gap: 8px;
  will-change: transform, opacity;
  transition: border-color 600ms var(--ease-out-soft);
}

.ticket__head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ticket__id {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.ticket__prio {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  color: var(--accent-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 2px 6px;
  border: 1px solid rgba(184, 155, 255, 0.3);
  border-radius: var(--r-pill);
  margin-left: auto;
}

.ticket__title {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
  color: var(--text);
}

.ticket--done .ticket__title {
  color: var(--text-muted);
  text-decoration: line-through;
  text-decoration-color: var(--text-dim);
  text-decoration-thickness: 1px;
}

.ticket__labels {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.ticket__label {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  padding: 2px 6px;
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  color: var(--text-muted);
}

/* Pulses */
.ticket--pulse-create {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent), 0 0 24px var(--accent-glow);
  animation: pulseGlow 1200ms var(--ease-out-soft);
}
.ticket--pulse-update {
  border-color: var(--accent-secondary);
  box-shadow: 0 0 0 1px var(--accent-secondary), 0 0 24px var(--accent-secondary-glow);
  animation: pulseGlow 1200ms var(--ease-out-soft);
}
.ticket--pulse-complete {
  border-color: var(--success);
  box-shadow: 0 0 0 1px var(--success), 0 0 32px var(--success-glow);
  animation: pulseGlow 1200ms var(--ease-out-soft);
}

@keyframes pulseGlow {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ticket {
    animation: none !important;
  }
}
</style>
