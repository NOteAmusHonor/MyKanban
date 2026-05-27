<script setup lang="ts">
import { motion } from 'motion-v'
import EyebrowPill from '@/components/ui/EyebrowPill.vue'

const ease = [0.22, 0.61, 0.36, 1] as [number, number, number, number]

const steps = [
  { n: '01', title: 'Installieren', cmd: 'npm install -g @mykanban/cli' },
  { n: '02', title: 'kanban.json anlegen', cmd: 'mykanban init' },
  { n: '03', title: 'Starten', cmd: 'mykanban  →  localhost:3737' },
]
</script>

<template>
  <section class="install" id="install">
    <div class="container">
      <header class="install__head">
        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.7, ease }"
        >
          <EyebrowPill>In 3 Schritten</EyebrowPill>
        </motion.div>
        <motion.h2
          class="install__title"
          :initial="{ opacity: 0, y: 24 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.8, delay: 0.1, ease }"
        >
          Von null auf produktiv.
          <span class="muted">In 60 Sekunden.</span>
        </motion.h2>
      </header>

      <div class="install__grid">
        <motion.div
          v-for="(s, i) in steps"
          :key="s.n"
          class="step"
          :initial="{ opacity: 0, y: 24 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.2 }"
          :transition="{ duration: 0.7, delay: 0.1 + i * 0.1, ease }"
        >
          <span class="step__n">{{ s.n }}</span>
          <h3 class="step__title">{{ s.title }}</h3>
          <code class="step__cmd">{{ s.cmd }}</code>
        </motion.div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.install { padding: var(--section-pad-y) 0; }
.install__head {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 56px;
  max-width: 720px;
}
.install__title {
  font-size: var(--fs-h2);
  letter-spacing: var(--ls-h2);
  line-height: var(--lh-tight);
  font-weight: 500;
  color: var(--text);
}
.install__title .muted { color: var(--text-muted); }
.install__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 880px) {
  .install__grid { grid-template-columns: 1fr; }
}
.step {
  padding: 28px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.step__n {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  color: var(--accent);
}
.step__title {
  font-size: var(--fs-h3);
  font-weight: 500;
  color: var(--text);
}
.step__cmd {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--text-muted);
  background: var(--bg);
  padding: 12px 14px;
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  word-break: break-all;
}
</style>
