import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homework',
      component: () => import('@/views/HomeworkView.vue'),
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: () => import('@/views/HomeworkView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/HomeworkView.vue'),
    },
  ],
})

export default router
