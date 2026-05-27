<script setup lang="ts">
import { motion } from 'motion-v'
import EyebrowPill from '@/components/ui/EyebrowPill.vue'

const ease = [0.22, 0.61, 0.36, 1] as [number, number, number, number]
</script>

<template>
  <section class="lf" id="local">
    <div class="container lf__grid">
      <div class="lf__copy">
        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.7, ease }"
        >
          <EyebrowPill variant="accent">
            <template #leading><span class="dot" /></template>
            Local-First
          </EyebrowPill>
        </motion.div>

        <motion.h2
          class="lf__title"
          :initial="{ opacity: 0, y: 24 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.8, delay: 0.1, ease }"
        >
          Deine Daten bleiben
          <span class="muted">genau dort, wo du sie hingelegt hast.</span>
        </motion.h2>

        <motion.p
          class="lf__text"
          :initial="{ opacity: 0, y: 16 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.8, delay: 0.2, ease }"
        >
          Eine einzige Datei. Kein Server, kein Account, kein Tracking. Git-versionierbar,
          Backup-tauglich, transparent. Wenn das Internet aus ist — arbeitest du weiter.
        </motion.p>

        <motion.ul
          class="lf__bullets"
          :initial="{ opacity: 0, y: 16 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.8, delay: 0.3, ease }"
        >
          <li><span class="check">✓</span> 0 Cloud-Calls · 0 Telemetrie · 0 Cookies</li>
          <li><span class="check">✓</span> Versionierbar mit git diff kanban.json</li>
          <li><span class="check">✓</span> Funktioniert in U-Bahn, Flugzeug, Bunker</li>
        </motion.ul>
      </div>

      <motion.aside
        class="lf__panel"
        :initial="{ opacity: 0, y: 28 }"
        :whileInView="{ opacity: 1, y: 0 }"
        :inViewOptions="{ once: true, amount: 0.2 }"
        :transition="{ duration: 0.9, delay: 0.2, ease }"
        aria-hidden="true"
      >
        <header class="lf__panel-head">
          <span class="lf__panel-dot" />
          <span class="lf__panel-path">~/projekte/mein-board/</span>
          <span class="lf__panel-badge">offline</span>
        </header>
        <div class="lf__panel-body">
          <div class="lf__file">
            <span class="lf__file-icon">▾</span>
            <span class="lf__file-name">kanban.json</span>
            <span class="lf__file-size">4.2 kb</span>
          </div>
          <div class="lf__file lf__file--muted">
            <span class="lf__file-icon">▸</span>
            <span class="lf__file-name">.git/</span>
          </div>
          <div class="lf__file lf__file--muted">
            <span class="lf__file-icon">▸</span>
            <span class="lf__file-name">README.md</span>
          </div>
          <div class="lf__divider" />
          <code class="lf__shell">
            <span class="prompt">$</span> git log --oneline kanban.json
          </code>
          <code class="lf__shell muted">a8f3c12 ai: schließe MK-031 ab</code>
          <code class="lf__shell muted">e2b9d04 ai: erstelle MK-042</code>
          <code class="lf__shell muted">7c1a888 init: 3 spalten, 12 tickets</code>
        </div>
      </motion.aside>
    </div>
  </section>
</template>

<style scoped>
.lf { padding: var(--section-pad-y) 0; }
.lf__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
@media (max-width: 980px) {
  .lf__grid { grid-template-columns: 1fr; gap: 40px; }
}
.lf__copy { display: flex; flex-direction: column; gap: 20px; align-items: flex-start; }
.dot {
  display: inline-block; width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent); box-shadow: 0 0 8px var(--accent-glow-strong);
}
.lf__title {
  font-size: var(--fs-h1);
  letter-spacing: var(--ls-h1);
  line-height: var(--lh-tight);
  font-weight: 500;
  color: var(--text);
}
.lf__title .muted { display: block; color: var(--text-muted); }
.lf__text {
  color: var(--text-muted);
  line-height: var(--lh-body);
  font-size: var(--fs-sub);
  max-width: 52ch;
}
.lf__bullets {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.lf__bullets li {
  font-size: var(--fs-body);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 12px;
}
.check {
  color: var(--accent);
  font-family: var(--font-mono);
  font-weight: 600;
}

.lf__panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  font-family: var(--font-mono);
  box-shadow: var(--shadow-card);
}
.lf__panel-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-elev);
}
.lf__panel-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--success); box-shadow: 0 0 8px var(--success-glow);
}
.lf__panel-path { font-size: 0.8125rem; color: var(--text); }
.lf__panel-badge {
  margin-left: auto;
  font-size: 0.625rem;
  color: var(--accent);
  border: 1px solid rgba(124,255,203,0.3);
  padding: 2px 8px;
  border-radius: var(--r-pill);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.lf__panel-body {
  padding: 18px 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lf__file {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: var(--r-sm);
  font-size: 0.8125rem;
  color: var(--text);
  background: rgba(124,255,203,0.04);
  border: 1px solid rgba(124,255,203,0.15);
}
.lf__file--muted {
  color: var(--text-muted);
  background: transparent;
  border-color: transparent;
}
.lf__file-icon { color: var(--text-dim); }
.lf__file-size {
  margin-left: auto;
  color: var(--text-dim);
  font-size: 0.6875rem;
}
.lf__divider {
  height: 1px;
  background: var(--border);
  margin: 12px 0;
}
.lf__shell {
  font-size: 0.75rem;
  color: var(--text);
  display: block;
  padding: 2px 8px;
}
.lf__shell.muted { color: var(--text-muted); }
.lf__shell .prompt { color: var(--accent); margin-right: 8px; }
</style>
