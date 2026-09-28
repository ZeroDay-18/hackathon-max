import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'init',
      component: () => import('@/views/LoadingView.vue'),
      meta: { hideTabBar: true },
    },
    {
      path: '/main',
      name: 'main',
      redirect: { name: 'dashboard' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
    },
    {
      path: '/quests',
      name: 'quests',
      component: () => import('@/views/QuestListView.vue'),
    },
    {
      path: '/quests/new',
      name: 'quest-create',
      component: () => import('@/views/QuestCreateView.vue'),
      meta: { hideTabBar: true },
    },
    {
      path: '/quests/:id',
      name: 'quest-detail',
      component: () => import('@/views/QuestDetailView.vue'),
      meta: { hideTabBar: true },
    },
    {
      path: '/guild',
      name: 'guild',
      component: () => import('@/views/GuildView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/ErrorVIew.vue'),
      meta: { hideTabBar: true },
      props: {
        title: 'Что-то пошло не так.',
        message: 'Пожалуйста, перезапустите приложение.',
      },
    },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.name !== 'init' && to.name !== 'NotFound' && !authStore.isAuth) {
    return { name: 'init' };
  }

  if (to.name === 'init' && authStore.isAuth) {
    return { name: 'dashboard' };
  }

  return true;
});

export default router;
