<script setup lang="ts">
import { useScroll, motion } from 'motion-v'

const { scrollYProgress } = useScroll()
</script>

<template>
  <div class="progress-track" aria-hidden="true">
    <motion.div class="progress-bar" :style="{ scaleX: scrollYProgress }" />
  </div>
</template>

<style scoped>
.progress-track {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: transparent;
  z-index: 100;
  pointer-events: none;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-secondary));
  transform-origin: left center;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .progress-bar {
    transition: none !important;
  }
}
</style>
