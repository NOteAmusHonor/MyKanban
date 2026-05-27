<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useAiScenario } from '@/composables/useAiScenario'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { motion } from 'motion-v'
import MiniBoard from '@/components/simulation/MiniBoard.vue'
import AiTerminal from '@/components/simulation/AiTerminal.vue'
import EyebrowPill from '@/components/ui/EyebrowPill.vue'

const reducedMotion = useReducedMotion()
const sectionRef = ref<HTMLElement | null>(null)

const engine = useAiScenario({ reducedMotion: () => reducedMotion.value })

let io: IntersectionObserver | null = null

onMounted(() => {
  if (!sectionRef.value) return
  io = new IntersectionObserver(
    (entries) => {
      const visible = entries[0]?.isIntersecting
      if (visible) engine.start()
      else engine.pause()
    },
    { threshold: 0.25 },
  )
  io.observe(sectionRef.value)
})

onBeforeUnmount(() => {
  io?.disconnect()
  engine.pause()
})
</script>

<template>
  <section ref="sectionRef" class="live-ai" id="live">
    <div class="container">
      <header class="live-ai__head">
        <motion.div
          :initial="{ opacity: 0, y: 24 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }"
        >
          <EyebrowPill variant="accent">
            <template #leading><span class="dot" /></template>
            Live · gerade jetzt
          </EyebrowPill>
        </motion.div>

        <motion.h2
          class="live-ai__title"
          :initial="{ opacity: 0, y: 24 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.8, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }"
        >
          Schau zu, wie die&nbsp;KI
          <span class="muted">gerade arbeitet.</span>
        </motion.h2>

        <motion.p
          class="live-ai__sub"
          :initial="{ opacity: 0, y: 16 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.8, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }"
        >
          Keine Aufnahme, kein Mockup. Eine deterministische Simulation der Tool-Calls,
          die ein Agent gegen <code>kanban.json</code> ausführen würde — Schritt für Schritt,
          offline, auf deinem Gerät.
        </motion.p>
      </header>

      <div class="live-ai__grid">
        <div class="live-ai__terminal">
          <AiTerminal :lines="engine.lines.value" :running="engine.state.value.running" />
        </div>
        <div class="live-ai__board">
          <MiniBoard
            :tickets-by-column="engine.ticketsByColumn.value"
            :pulsed="engine.pulsed.value"
          />
        </div>
      </div>

      <p class="live-ai__caption">
        <span class="caption__dot caption__dot--create" /> erstellt
        <span class="caption__dot caption__dot--update" /> bearbeitet
        <span class="caption__dot caption__dot--complete" /> abgeschlossen
        — alles ohne Cloud-Call.
      </p>
    </div>
  </section>
</template>

<style scoped>
.live-ai {
  padding: var(--section-pad-y) 0;
  position: relative;
}

.live-ai__head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  max-width: 760px;
  margin-bottom: 64px;
}

.live-ai__title {
  font-size: var(--fs-h1);
  letter-spacing: var(--ls-h1);
  line-height: var(--lh-tight);
  font-weight: 500;
  color: var(--text);
}
.live-ai__title .muted {
  color: var(--text-muted);
}

.live-ai__sub {
  font-size: var(--fs-sub);
  color: var(--text-muted);
  line-height: var(--lh-body);
  max-width: 640px;
}
.live-ai__sub code {
  font-family: var(--font-mono);
  font-size: 0.95em;
  color: var(--accent);
  background: rgba(124, 255, 203, 0.08);
  padding: 1px 6px;
  border-radius: var(--r-sm);
}

.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent-glow-strong);
}

.live-ai__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

@media (max-width: 980px) {
  .live-ai__grid {
    grid-template-columns: 1fr;
  }
}

.live-ai__caption {
  margin-top: 32px;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.caption__dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
}
.caption__dot--create { background: var(--accent); }
.caption__dot--update { background: var(--accent-secondary); }
.caption__dot--complete { background: var(--success); }
</style>
