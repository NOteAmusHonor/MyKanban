<script setup lang="ts">
import { motion } from 'motion-v'
import EyebrowPill from '@/components/ui/EyebrowPill.vue'
import CodeBlock from '@/components/ui/CodeBlock.vue'

const ease = [0.22, 0.61, 0.36, 1] as [number, number, number, number]
</script>

<template>
  <section class="ai-int" id="integration">
    <div class="container ai-int__grid">
      <div class="ai-int__copy">
        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.7, ease }"
        >
          <EyebrowPill>KI-Integration</EyebrowPill>
        </motion.div>

        <motion.h2
          class="ai-int__title"
          :initial="{ opacity: 0, y: 24 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.8, delay: 0.1, ease }"
        >
          Lass deine KI direkt
          <span class="muted">die kanban.json editieren.</span>
        </motion.h2>

        <motion.p
          class="ai-int__text"
          :initial="{ opacity: 0, y: 16 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.8, delay: 0.2, ease }"
        >
          Ein offenes JSON-Schema. Keine proprietären APIs. Jeder Agent — Claude, GPT, lokale Modelle —
          kann lesen, schreiben, validieren. chokidar erkennt den Edit, das Board reagiert in &lt; 50 ms.
        </motion.p>
      </div>

      <motion.div
        class="ai-int__code"
        :initial="{ opacity: 0, y: 32 }"
        :whileInView="{ opacity: 1, y: 0 }"
        :inViewOptions="{ once: true, amount: 0.2 }"
        :transition="{ duration: 0.9, delay: 0.2, ease }"
      >
        <CodeBlock filename="kanban.json" language="json">
<span class="tok-key">{</span>
  <span class="tok-key">"columns"</span>: [
    {
      <span class="tok-key">"id"</span>: <span class="tok-str">"doing"</span>,
      <span class="tok-key">"title"</span>: <span class="tok-str">"Doing"</span>,
      <span class="tok-key">"tickets"</span>: [
        {
          <span class="tok-key">"ticketNumber"</span>: <span class="tok-num">4231</span>,
          <span class="tok-key">"title"</span>: <span class="tok-str">"Refactor: Auth-Middleware"</span>,
          <span class="tok-key">"description"</span>: <span class="tok-str">"## Ziel\nMiddleware extrahieren …"</span>,
          <span class="tok-key">"order"</span>: <span class="tok-num">0</span>
        }
      ]
    }
  ]
<span class="tok-key">}</span>
        </CodeBlock>
      </motion.div>
    </div>
  </section>
</template>

<style scoped>
.ai-int { padding: var(--section-pad-y) 0; }
.ai-int__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
@media (max-width: 980px) {
  .ai-int__grid { grid-template-columns: 1fr; gap: 40px; }
}
.ai-int__copy { display: flex; flex-direction: column; gap: 20px; align-items: flex-start; }
.ai-int__title {
  font-size: var(--fs-h1);
  letter-spacing: var(--ls-h1);
  line-height: var(--lh-tight);
  font-weight: 500;
  color: var(--text);
}
.ai-int__title .muted { display: block; color: var(--text-muted); }
.ai-int__text {
  color: var(--text-muted);
  line-height: var(--lh-body);
  font-size: var(--fs-sub);
  max-width: 56ch;
}
</style>
