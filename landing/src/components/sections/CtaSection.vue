<script setup lang="ts">
import { motion } from 'motion-v'
import BaseButton from '@/components/ui/BaseButton.vue'

const ease = [0.22, 0.61, 0.36, 1] as [number, number, number, number]
</script>

<template>
  <section class="cta" id="cta">
    <div class="cta__bg" aria-hidden="true" />
    <div class="container cta__inner">
      <motion.h2
        class="cta__title"
        :initial="{ opacity: 0, y: 28 }"
        :whileInView="{ opacity: 1, y: 0 }"
        :inViewOptions="{ once: true, amount: 0.3 }"
        :transition="{ duration: 0.9, ease }"
      >
        Hol's dir.
        <span class="muted">Lokal. Selbstläufig.</span>
      </motion.h2>
      <motion.p
        class="cta__sub"
        :initial="{ opacity: 0, y: 16 }"
        :whileInView="{ opacity: 1, y: 0 }"
        :inViewOptions="{ once: true, amount: 0.3 }"
        :transition="{ duration: 0.9, delay: 0.15, ease }"
      >
        Open Source. MIT-Lizenz. Eine Datei, deine Daten.
      </motion.p>
      <motion.div
        class="cta__actions"
        :initial="{ opacity: 0, y: 16 }"
        :whileInView="{ opacity: 1, y: 0 }"
        :inViewOptions="{ once: true, amount: 0.3 }"
        :transition="{ duration: 0.9, delay: 0.3, ease }"
      >
        <BaseButton variant="primary" size="lg" href="https://github.com/NOteAmusHonor/MyKanban">
          Auf GitHub ansehen
        </BaseButton>
        <BaseButton variant="ghost" size="lg" href="#install">Installation</BaseButton>
      </motion.div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  padding: clamp(140px, 22vh, 240px) 0;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  text-align: center;
}
.cta__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124, 255, 203, 0.12), transparent 70%),
    radial-gradient(ellipse 80% 60% at 50% 100%, rgba(184, 155, 255, 0.08), transparent 70%);
}
.cta__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}
.cta__title {
  font-size: var(--fs-h1);
  letter-spacing: var(--ls-h1);
  line-height: var(--lh-tight);
  font-weight: 500;
  color: var(--text);
}
.cta__title .muted { display: block; color: var(--text-muted); }
.cta__sub {
  font-size: var(--fs-sub);
  color: var(--text-muted);
  max-width: 50ch;
}
.cta__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 8px;
}
</style>
