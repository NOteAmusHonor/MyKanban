<script setup lang="ts">
import { motion } from 'motion-v'
import EyebrowPill from '@/components/ui/EyebrowPill.vue'

const pillars = [
  {
    icon: '+',
    title: 'Tickets erstellen',
    text: 'Die KI fügt neue Tickets direkt in deine kanban.json ein — mit Titel, Description (Markdown), Labels und Spalte.',
    tone: 'create',
  },
  {
    icon: '✎',
    title: 'Tickets bearbeiten',
    text: 'Sie ergänzt Beschreibungen, verschiebt zwischen Spalten, vergibt Prioritäten — autonom, deterministisch, nachvollziehbar.',
    tone: 'update',
  },
  {
    icon: '✓',
    title: 'Tickets abschließen',
    text: 'Done heißt done. Die KI markiert fertige Arbeit, hinterlässt eine Notiz — und das nächste Ticket startet.',
    tone: 'complete',
  },
]

const ease = [0.22, 0.61, 0.36, 1] as [number, number, number, number]
</script>

<template>
  <section class="offline" id="offline">
    <div class="container">
      <header class="offline__head">
        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.7, ease }"
        >
          <EyebrowPill>Der Kern</EyebrowPill>
        </motion.div>

        <motion.h2
          class="offline__title"
          :initial="{ opacity: 0, y: 28 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.8, delay: 0.1, ease }"
        >
          Erstellen. Bearbeiten. Abschließen.
          <span class="muted">Alles autonom. Alles lokal.</span>
        </motion.h2>

        <motion.p
          class="offline__sub"
          :initial="{ opacity: 0, y: 16 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.8, delay: 0.2, ease }"
        >
          Bisher konnten KIs vorschlagen. MyKanban gibt deiner KI die Werkzeuge, das Board selbst zu führen —
          ohne dass je ein Byte deinen Rechner verlässt.
        </motion.p>
      </header>

      <div class="offline__grid">
        <motion.article
          v-for="(p, i) in pillars"
          :key="p.title"
          :class="['pillar', `pillar--${p.tone}`]"
          :initial="{ opacity: 0, y: 32 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.2 }"
          :transition="{ duration: 0.7, delay: 0.1 + i * 0.1, ease }"
        >
          <span class="pillar__icon">{{ p.icon }}</span>
          <h3 class="pillar__title">{{ p.title }}</h3>
          <p class="pillar__text">{{ p.text }}</p>
        </motion.article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.offline {
  padding: var(--section-pad-y) 0;
}

.offline__head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  max-width: 760px;
  margin-bottom: 64px;
}

.offline__title {
  font-size: var(--fs-h1);
  letter-spacing: var(--ls-h1);
  line-height: var(--lh-tight);
  font-weight: 500;
  color: var(--text);
}
.offline__title .muted {
  display: block;
  color: var(--text-muted);
}

.offline__sub {
  font-size: var(--fs-sub);
  color: var(--text-muted);
  line-height: var(--lh-body);
  max-width: 60ch;
}

.offline__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 880px) {
  .offline__grid {
    grid-template-columns: 1fr;
  }
}

.pillar {
  padding: 28px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  transition: border-color var(--d-short) var(--ease-out-soft), transform var(--d-short) var(--ease-out-soft);
}

.pillar:hover {
  transform: translateY(-3px);
  border-color: var(--border-strong);
}

.pillar__icon {
  width: 40px;
  height: 40px;
  border-radius: var(--r-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 1.25rem;
  background: var(--bg-elev);
  border: 1px solid var(--border);
}

.pillar--create .pillar__icon {
  color: var(--accent);
  border-color: rgba(124, 255, 203, 0.3);
}
.pillar--update .pillar__icon {
  color: var(--accent-secondary);
  border-color: rgba(184, 155, 255, 0.3);
}
.pillar--complete .pillar__icon {
  color: var(--success);
  border-color: rgba(94, 230, 168, 0.3);
}

.pillar__title {
  font-size: var(--fs-h3);
  font-weight: 500;
  color: var(--text);
  letter-spacing: -0.01em;
}

.pillar__text {
  color: var(--text-muted);
  line-height: var(--lh-body);
  font-size: var(--fs-body);
}
</style>
