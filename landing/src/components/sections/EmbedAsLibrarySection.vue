<script setup lang="ts">
import { motion } from 'motion-v'
import EyebrowPill from '@/components/ui/EyebrowPill.vue'
import CodeBlock from '@/components/ui/CodeBlock.vue'

const ease = [0.22, 0.61, 0.36, 1] as [number, number, number, number]
</script>

<template>
  <section class="lib" id="library">
    <div class="container lib__grid">
      <motion.div
        class="lib__code"
        :initial="{ opacity: 0, y: 28 }"
        :whileInView="{ opacity: 1, y: 0 }"
        :inViewOptions="{ once: true, amount: 0.2 }"
        :transition="{ duration: 0.9, ease }"
      >
        <CodeBlock filename="App.vue" language="vue">
<span class="tok-com">// 1. installieren</span>
<span class="tok-com">// npm install @mykanban/board</span>

<span class="tok-key">&lt;script setup lang=</span><span class="tok-str">"ts"</span><span class="tok-key">&gt;</span>
<span class="tok-key">import</span> { <span class="tok-fn">KanbanBoard</span> } <span class="tok-key">from</span> <span class="tok-str">'@mykanban/board'</span>
<span class="tok-key">import</span> <span class="tok-str">'@mykanban/board/style.css'</span>
<span class="tok-key">&lt;/script&gt;</span>

<span class="tok-key">&lt;template&gt;</span>
  <span class="tok-key">&lt;</span><span class="tok-fn">KanbanBoard</span>
    <span class="tok-key">source=</span><span class="tok-str">"./kanban.json"</span>
    <span class="tok-key">:realtime=</span><span class="tok-str">"true"</span>
  <span class="tok-key">/&gt;</span>
<span class="tok-key">&lt;/template&gt;</span>

<span class="tok-ok">✓ Vue 3 · Pinia · vue-router als Peers</span>
        </CodeBlock>
      </motion.div>

      <div class="lib__copy">
        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.7, ease }"
        >
          <EyebrowPill>Als Library</EyebrowPill>
        </motion.div>

        <motion.h2
          class="lib__title"
          :initial="{ opacity: 0, y: 24 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.8, delay: 0.1, ease }"
        >
          Embed das Board.
          <span class="muted">Eine Zeile Import.</span>
        </motion.h2>

        <motion.p
          class="lib__text"
          :initial="{ opacity: 0, y: 16 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.8, delay: 0.2, ease }"
        >
          MyKanban liefert sich auch als npm-Library aus. Drop-in-Komponente in jede Vue-3-App,
          gleicher Echtzeit-Sync, gleiche KI-Integration — du behältst die Kontrolle über Build,
          Routing und Styling.
        </motion.p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lib { padding: var(--section-pad-y) 0; }
.lib__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
@media (max-width: 980px) {
  .lib__grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .lib__code { order: 2; }
}
.lib__copy { display: flex; flex-direction: column; gap: 20px; align-items: flex-start; }
.lib__title {
  font-size: var(--fs-h1);
  letter-spacing: var(--ls-h1);
  line-height: var(--lh-tight);
  font-weight: 500;
  color: var(--text);
}
.lib__title .muted { display: block; color: var(--text-muted); }
.lib__text {
  color: var(--text-muted);
  line-height: var(--lh-body);
  font-size: var(--fs-sub);
  max-width: 56ch;
}
</style>
