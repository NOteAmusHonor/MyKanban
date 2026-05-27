<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <span class="footer__dot" />
        <span>MyKanban</span>
      </div>
      <p class="footer__copy">
        © {{ year }} · MIT-Lizenz · gebaut für Entwickler, die ihre Daten behalten wollen.
      </p>
      <nav class="footer__links" aria-label="Footer">
        <a href="https://github.com/NOteAmusHonor/MyKanban" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="#install">Installation</a>
        <a href="#faq">FAQ</a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--border);
  padding: 48px 0 64px;
  background: var(--bg);
}
.footer__inner {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.footer__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  font-weight: 500;
}
.footer__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent-glow-strong);
}
.footer__copy {
  color: var(--text-muted);
  font-size: 0.875rem;
}
.footer__links {
  margin-left: auto;
  display: flex;
  gap: 24px;
}
.footer__links a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color var(--d-micro);
}
.footer__links a:hover { color: var(--text); }
</style>
