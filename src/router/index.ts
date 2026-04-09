import { createRouter, createWebHistory } from 'vue-router'
import KanbanBoard from '@/components/board/KanbanBoard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: KanbanBoard,
    },
  ],
})

export default router
