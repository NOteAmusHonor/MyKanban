<script setup lang="ts">
import { motion } from 'motion-v'
import EyebrowPill from '@/components/ui/EyebrowPill.vue'

const features = [
  {
    title: 'Local-First',
    text: 'Eine einzelne kanban.json auf deiner Platte. Versionierbar mit Git, lesbar mit cat, editierbar von allem.',
  },
  {
    title: 'KI-autonom',
    text: 'Strukturierte Tool-Calls statt freier Prosa. Deine KI handelt — du reviewst.',
  },
  {
    title: 'Echtzeit-Sync',
    text: 'chokidar + WebSocket. Ändert die KI die Datei, springt das UI in jedem Tab sofort mit.',
  },
  {
    title: 'Als npm-Library',
    text: 'import { KanbanBoard } from "@mykanban/board" — embed das Board in deine eigene App.',
  },
  {
    title: 'Markdown-nativ',
    text: 'Description als Markdown. Code-Fences, Listen, Links — wie GitHub-Issues, nur offline.',
  },
  {
    title: 'Drag & Drop',
    text: 'Spalten und Tickets per Maus, Touch oder Tastatur. Die KI nutzt dieselben Bewegungen.',
  },
]

const ease = [0.22, 0.61, 0.36, 1] as [number, number, number, number]
</script>

<template>
  <section class="features" id="features">
    <div class="container">
      <header class="features__head">
        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.7, ease }"
        >
          <EyebrowPill>Was es kann</EyebrowPill>
        </motion.div>
        <motion.h2
          class="features__title"
          :initial="{ opacity: 0, y: 24 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.8, delay: 0.1, ease }"
        >
          Schlank. Lokal. <span class="muted">Erweiterbar.</span>
        </motion.h2>
      </header>

      <div class="features__grid">
        <motion.article
          v-for="(f, i) in features"
          :key="f.title"
          class="feature"
          :initial="{ opacity: 0, y: 24 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.15 }"
          :transition="{ duration: 0.6, delay: i * 0.06, ease }"
        >
          <span class="feature__bullet" aria-hidden="true" />
          <h3 class="feature__title">{{ f.title }}</h3>
          <p class="feature__text">{{ f.text }}</p>
        </motion.article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features {
  padding: var(--section-pad-y) 0;
}
.features__head {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 56px;
  max-width: 720px;
}
.features__title {
  font-size: var(--fs-h2);
  letter-spacing: var(--ls-h2);
  line-height: var(--lh-tight);
  font-weight: 500;
  color: var(--text);
}
.features__title .muted { color: var(--text-muted); }

.features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
}
@media (max-width: 880px) {
  .features__grid { grid-template-columns: 1fr; }
}

.feature {
  padding: 32px 28px;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: background var(--d-short) var(--ease-out-soft);
}
.feature:hover { background: var(--surface); }

.feature__bullet {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent-glow-strong);
  margin-bottom: 4px;
}

.feature__title {
  font-size: var(--fs-h3);
  font-weight: 500;
  color: var(--text);
}
.feature__text {
  color: var(--text-muted);
  line-height: var(--lh-body);
  font-size: var(--fs-body);
}
</style>
