<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const scrolled = ref(false)
const onScroll = () => {
  scrolled.value = window.scrollY > 16
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header :class="['nav', scrolled && 'nav--scrolled']">
    <div class="container nav__inner">
      <a href="#top" class="nav__brand" aria-label="MyKanban">
        <span class="nav__dot" />
        <span class="nav__brand-name">MyKanban</span>
      </a>

      <nav class="nav__links" aria-label="Hauptnavigation">
        <a href="#offline">Offline-KI</a>
        <a href="#live">Live</a>
        <a href="#features">Features</a>
        <a href="#install">Installation</a>
        <a href="#faq">FAQ</a>
      </nav>

      <a class="nav__github" href="https://github.com/NOteAmusHonor/MyKanban" target="_blank" rel="noopener noreferrer">
        GitHub →
      </a>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: var(--nav-height);
  display: flex;
  align-items: center;
  transition: background var(--d-short) var(--ease-out-soft), border-color var(--d-short);
  border-bottom: 1px solid transparent;
}
.nav--scrolled {
  background: rgba(8, 8, 11, 0.7);
  backdrop-filter: saturate(180%) blur(14px);
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  border-bottom-color: var(--border);
}
.nav__inner {
  display: flex;
  align-items: center;
  gap: 32px;
  width: 100%;
}
.nav__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  letter-spacing: -0.005em;
}
.nav__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent-glow-strong);
}
.nav__brand-name { font-size: 0.9375rem; }

.nav__links {
  display: flex;
  gap: 28px;
  margin-left: 24px;
}
.nav__links a {
  color: var(--text-muted);
  font-size: 0.875rem;
  text-decoration: none;
  transition: color var(--d-micro) var(--ease-out-soft);
}
.nav__links a:hover { color: var(--text); }

.nav__github {
  margin-left: auto;
  color: var(--text);
  font-size: 0.875rem;
  text-decoration: none;
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  transition: border-color var(--d-micro), color var(--d-micro);
}
.nav__github:hover {
  color: var(--accent);
  border-color: var(--accent);
}

@media (max-width: 720px) {
  .nav__links { display: none; }
}
</style>
