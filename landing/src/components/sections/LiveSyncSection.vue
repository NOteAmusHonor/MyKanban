<script setup lang="ts">
import { motion } from 'motion-v'
import EyebrowPill from '@/components/ui/EyebrowPill.vue'

const ease = [0.22, 0.61, 0.36, 1] as [number, number, number, number]
</script>

<template>
  <section class="ls" id="sync">
    <div class="container">
      <header class="ls__head">
        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.7, ease }"
        >
          <EyebrowPill>Echtzeit-Sync</EyebrowPill>
        </motion.div>
        <motion.h2
          class="ls__title"
          :initial="{ opacity: 0, y: 24 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.8, delay: 0.1, ease }"
        >
          Datei ändert sich — <span class="muted">jedes Tab springt mit.</span>
        </motion.h2>
        <motion.p
          class="ls__sub"
          :initial="{ opacity: 0, y: 16 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.8, delay: 0.2, ease }"
        >
          chokidar lauscht auf <code>kanban.json</code>. Schreibt die KI, dein Editor, oder ein zweites Tab —
          ein WebSocket-Broadcast erreicht alle Clients in unter 50 ms.
        </motion.p>
      </header>

      <motion.div
        class="ls__flow"
        :initial="{ opacity: 0, y: 28 }"
        :whileInView="{ opacity: 1, y: 0 }"
        :inViewOptions="{ once: true, amount: 0.25 }"
        :transition="{ duration: 0.9, delay: 0.1, ease }"
      >
        <div class="node node--ai">
          <span class="node__icon">AI</span>
          <span class="node__label">KI-Agent</span>
          <span class="node__sub">schreibt</span>
        </div>

        <div class="edge" aria-hidden="true">
          <span class="edge__line" />
          <span class="edge__pulse edge__pulse--1" />
          <span class="edge__pulse edge__pulse--2" />
        </div>

        <div class="node node--file">
          <span class="node__icon">{ }</span>
          <span class="node__label">kanban.json</span>
          <span class="node__sub">chokidar watch</span>
        </div>

        <div class="edge edge--branched" aria-hidden="true">
          <span class="edge__line" />
          <span class="edge__pulse edge__pulse--1" />
          <span class="edge__pulse edge__pulse--2" />
        </div>

        <div class="node-stack">
          <div class="node node--client">
            <span class="node__icon">▦</span>
            <span class="node__label">Tab 1</span>
            <span class="node__sub">&lt; 50 ms</span>
          </div>
          <div class="node node--client">
            <span class="node__icon">▦</span>
            <span class="node__label">Tab 2</span>
            <span class="node__sub">&lt; 50 ms</span>
          </div>
          <div class="node node--client">
            <span class="node__icon">▦</span>
            <span class="node__label">Embed</span>
            <span class="node__sub">&lt; 50 ms</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
</template>

<style scoped>
.ls { padding: var(--section-pad-y) 0; }
.ls__head {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 56px;
  max-width: 720px;
}
.ls__title {
  font-size: var(--fs-h2);
  letter-spacing: var(--ls-h2);
  line-height: var(--lh-tight);
  font-weight: 500;
  color: var(--text);
}
.ls__title .muted { color: var(--text-muted); }
.ls__sub {
  color: var(--text-muted);
  line-height: var(--lh-body);
  font-size: var(--fs-sub);
  max-width: 60ch;
}
.ls__sub code {
  font-family: var(--font-mono);
  color: var(--accent);
  background: rgba(124, 255, 203, 0.08);
  padding: 1px 6px;
  border-radius: var(--r-sm);
  font-size: 0.95em;
}

.ls__flow {
  display: grid;
  grid-template-columns: auto 1fr auto 1fr auto;
  align-items: center;
  gap: 24px;
  padding: 48px 32px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-card);
}

@media (max-width: 880px) {
  .ls__flow {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 32px 20px;
  }
}

.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px 22px;
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  min-width: 140px;
}
.node__icon {
  font-family: var(--font-mono);
  font-size: 1.125rem;
  width: 36px;
  height: 36px;
  border-radius: var(--r-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border: 1px solid var(--border);
}
.node--ai .node__icon { color: var(--accent-secondary); border-color: rgba(184,155,255,0.3); }
.node--file .node__icon { color: var(--accent); border-color: rgba(124,255,203,0.3); }
.node--client .node__icon { color: var(--success); border-color: rgba(94,230,168,0.3); }

.node__label {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text);
}
.node__sub {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-muted);
}

.node-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edge {
  position: relative;
  height: 2px;
  background: transparent;
}
.edge__line {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--border-strong), var(--border));
}
.edge__pulse {
  position: absolute;
  top: 50%;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent-glow-strong);
  transform: translateY(-50%);
  animation: pulseRun 2.4s var(--ease-in-out-calm) infinite;
}
.edge__pulse--2 { animation-delay: 1.2s; background: var(--accent-secondary); box-shadow: 0 0 12px var(--accent-secondary-glow); }

@keyframes pulseRun {
  0% { left: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

@media (max-width: 880px) {
  .edge { height: 24px; }
  .edge__line { left: 50%; width: 2px; height: 100%; background: var(--border); }
  .edge__pulse { top: 0; left: 50%; transform: translateX(-50%); animation: pulseRunV 2.4s var(--ease-in-out-calm) infinite; }
}
@keyframes pulseRunV {
  0% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .edge__pulse { animation: none !important; opacity: 0.6; }
}
</style>
