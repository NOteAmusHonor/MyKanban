<script setup lang="ts">
import { ref } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import EyebrowPill from '@/components/ui/EyebrowPill.vue'

interface Item { q: string; a: string }
const items: Item[] = [
  {
    q: 'Wie kann die KI wirklich offline arbeiten?',
    a: 'MyKanban speichert alles in einer lokalen kanban.json. Ein lokal laufendes Modell oder ein Agent mit Datei-Zugriff editiert sie direkt. Es gibt keine MyKanban-Cloud, keinen Telemetrie-Endpunkt, keinen Account.',
  },
  {
    q: 'Welche KI funktioniert?',
    a: 'Jede, die Dateien lesen und schreiben kann oder JSON-Tool-Calls produziert: Claude, GPT, Gemini, lokale Modelle via Ollama, Cursor, Aider — das Schema ist offen und dokumentiert.',
  },
  {
    q: 'Was passiert, wenn ich gleichzeitig im UI editiere?',
    a: 'chokidar erkennt externe Änderungen, der Server broadcastet via WebSocket an alle Tabs. Optimistische UI im Frontend, letzter Schreiber gewinnt — wie bei jedem Git-Workflow.',
  },
  {
    q: 'Kann ich das Board in meine eigene App einbetten?',
    a: 'Ja. npm install @mykanban/board und import { KanbanBoard } from "@mykanban/board" — Vue 3 / Pinia / vue-router sind Peer-Dependencies.',
  },
  {
    q: 'Open Source?',
    a: 'Ja, MIT. github.com/NOteAmusHonor/MyKanban',
  },
]

const open = ref<number | null>(0)
const toggle = (i: number) => (open.value = open.value === i ? null : i)

const ease = [0.22, 0.61, 0.36, 1] as [number, number, number, number]
</script>

<template>
  <section class="faq" id="faq">
    <div class="container">
      <header class="faq__head">
        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.7, ease }"
        >
          <EyebrowPill>FAQ</EyebrowPill>
        </motion.div>
        <motion.h2
          class="faq__title"
          :initial="{ opacity: 0, y: 24 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.8, delay: 0.1, ease }"
        >
          Fragen, die <span class="muted">jeder zuerst stellt.</span>
        </motion.h2>
      </header>

      <ul class="faq__list">
        <li v-for="(it, i) in items" :key="i" class="faq__item">
          <button class="faq__q" :aria-expanded="open === i" @click="toggle(i)">
            <span>{{ it.q }}</span>
            <span class="faq__plus" :class="open === i && 'faq__plus--open'" aria-hidden="true">+</span>
          </button>
          <AnimatePresence>
            <motion.div
              v-if="open === i"
              class="faq__a"
              :initial="{ opacity: 0, height: 0 }"
              :animate="{ opacity: 1, height: 'auto' }"
              :exit="{ opacity: 0, height: 0 }"
              :transition="{ duration: 0.4, ease }"
            >
              <p>{{ it.a }}</p>
            </motion.div>
          </AnimatePresence>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.faq { padding: var(--section-pad-y) 0; }
.faq__head {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 48px;
  max-width: 720px;
}
.faq__title {
  font-size: var(--fs-h2);
  letter-spacing: var(--ls-h2);
  line-height: var(--lh-tight);
  font-weight: 500;
  color: var(--text);
}
.faq__title .muted { color: var(--text-muted); }
.faq__list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid var(--border);
}
.faq__item {
  border-bottom: 1px solid var(--border);
}
.faq__q {
  width: 100%;
  background: transparent;
  border: none;
  color: var(--text);
  font-family: var(--font-sans);
  font-size: var(--fs-sub);
  font-weight: 500;
  text-align: left;
  padding: 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  cursor: pointer;
  transition: color var(--d-micro) var(--ease-out-soft);
}
.faq__q:hover { color: var(--accent); }
.faq__plus {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  color: var(--text-muted);
  transition: transform var(--d-short) var(--ease-out-snap), color var(--d-micro);
  line-height: 1;
}
.faq__plus--open {
  transform: rotate(45deg);
  color: var(--accent);
}
.faq__a {
  overflow: hidden;
  color: var(--text-muted);
  line-height: var(--lh-body);
}
.faq__a p {
  padding-bottom: 24px;
  max-width: 70ch;
}
</style>
