<script setup lang="ts">
import { motion } from 'motion-v'
import EyebrowPill from '@/components/ui/EyebrowPill.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const ease = [0.22, 0.61, 0.36, 1] as [number, number, number, number]
</script>

<template>
  <section class="hero" id="top">
    <div class="hero__bg" aria-hidden="true">
      <div class="hero__glow hero__glow--a" />
      <div class="hero__glow hero__glow--b" />
      <div class="hero__grid" />
    </div>

    <div class="container hero__inner">
      <motion.div
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, ease }"
      >
        <EyebrowPill variant="accent">
          <template #leading><span class="dot" /></template>
          v1.0 · 100 % offline · open source
        </EyebrowPill>
      </motion.div>

      <motion.h1
        class="hero__title"
        :initial="{ opacity: 0, y: 28 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.9, delay: 0.1, ease }"
      >
        Dein Kanban-Board.
        <motion.span
          class="hero__title-line2"
          :initial="{ opacity: 0, y: 28 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.9, delay: 0.3, ease }"
        >
          Geführt von KI. Ohne Cloud.
        </motion.span>
      </motion.h1>

      <motion.p
        class="hero__sub"
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, delay: 0.5, ease }"
      >
        Endlich erstellt, bearbeitet und schließt eine KI Tickets <strong>komplett selbständig</strong> ab —
        direkt in einer lokalen <code>kanban.json</code>. Keine API. Kein Account. Keine Daten, die dein Gerät verlassen.
      </motion.p>

      <motion.div
        class="hero__cta"
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.7, delay: 0.7, ease }"
      >
        <BaseButton variant="primary" size="lg" href="#live">Live ansehen</BaseButton>
        <BaseButton variant="ghost" size="lg" href="https://github.com/NOteAmusHonor/MyKanban">
          GitHub
        </BaseButton>
      </motion.div>

      <motion.aside
        class="hero__card"
        :initial="{ opacity: 0, y: 40, scale: 0.96 }"
        :animate="{ opacity: 1, y: 0, scale: 1 }"
        :transition="{ duration: 1.1, delay: 0.6, ease }"
        aria-hidden="true"
      >
        <header class="hero__card-head">
          <span class="hero__card-dot" />
          <span class="hero__card-title">MK-042 · Refactor Auth-Middleware</span>
          <span class="hero__card-status">doing</span>
        </header>
        <div class="hero__card-body">
          <code class="hero__card-code">tools.update_ticket({ id: "MK-042", column: "done" })</code>
          <div class="hero__card-bar">
            <motion.div
              class="hero__card-progress"
              :initial="{ scaleX: 0 }"
              :animate="{ scaleX: 1 }"
              :transition="{ duration: 2.4, delay: 1.6, ease: [0.65, 0, 0.35, 1] }"
            />
          </div>
          <div class="hero__card-foot">
            <span>✓ verifiziert lokal</span>
            <span class="hero__card-time">0 ms · offline</span>
          </div>
        </div>
      </motion.aside>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding-top: calc(var(--nav-height) + clamp(80px, 12vh, 160px));
  padding-bottom: clamp(80px, 12vh, 180px);
  overflow: hidden;
  isolation: isolate;
}

.hero__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.hero__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.5;
}
.hero__glow--a {
  width: 720px;
  height: 720px;
  top: -200px;
  left: -120px;
  background: radial-gradient(circle, rgba(124, 255, 203, 0.22), transparent 70%);
}
.hero__glow--b {
  width: 600px;
  height: 600px;
  bottom: -240px;
  right: -120px;
  background: radial-gradient(circle, rgba(184, 155, 255, 0.18), transparent 70%);
}

.hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 80%);
}

.hero__inner {
  display: flex;
  flex-direction: column;
  gap: 28px;
  align-items: flex-start;
  position: relative;
}

.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent-glow-strong);
}

.hero__title {
  font-size: var(--fs-hero);
  letter-spacing: var(--ls-hero);
  line-height: var(--lh-hero);
  font-weight: 500;
  color: var(--text);
  max-width: 14ch;
}

.hero__title-line2 {
  display: block;
  color: var(--text-muted);
}

.hero__sub {
  font-size: var(--fs-sub);
  color: var(--text-muted);
  line-height: var(--lh-body);
  max-width: 64ch;
  margin-top: 8px;
}

.hero__sub strong {
  color: var(--text);
  font-weight: 500;
}

.hero__sub code {
  font-family: var(--font-mono);
  font-size: 0.95em;
  color: var(--accent);
  background: rgba(124, 255, 203, 0.08);
  padding: 1px 6px;
  border-radius: var(--r-sm);
}

.hero__cta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.hero__card {
  margin-top: 48px;
  width: min(560px, 100%);
  padding: 18px 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-card);
  align-self: flex-end;
  position: relative;
}

.hero__card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: var(--r-lg);
  padding: 1px;
  background: linear-gradient(135deg, var(--accent) 0%, transparent 40%, transparent 60%, var(--accent-secondary) 100%);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.35;
  pointer-events: none;
}

.hero__card-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.hero__card-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-secondary);
  box-shadow: 0 0 8px var(--accent-secondary-glow);
}
.hero__card-title {
  font-size: 0.8125rem;
  color: var(--text);
  font-family: var(--font-mono);
}
.hero__card-status {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--accent-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.hero__card-body {
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero__card-code {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--accent);
  word-break: break-word;
}

.hero__card-bar {
  height: 4px;
  border-radius: 2px;
  background: var(--bg-elev);
  overflow: hidden;
}
.hero__card-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--success));
  transform-origin: left;
  will-change: transform;
}

.hero__card-foot {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--success);
}
.hero__card-foot .hero__card-time {
  color: var(--text-muted);
}

@media (prefers-reduced-motion: reduce) {
  .hero__card-progress {
    transform: scaleX(1) !important;
  }
}
</style>
