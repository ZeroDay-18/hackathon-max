import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('@/views/TasksView.vue'),
    },
    {
      path: '/tasks/:id',
      name: 'quest-detail',
      component: () => import('@/views/QuestDetailView.vue'),
    },
    {
      path: '/tasks/:id/complete',
      name: 'quest-complete',
      component: () => import('@/views/QuestCompleteView.vue'),
    },
    {
      path: '/groups',
      name: 'groups',
      component: () => import('@/views/GroupsView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
  ],
})

export default router
