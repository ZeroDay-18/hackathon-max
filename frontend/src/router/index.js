import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'init',
      component: () => import('@/views/LoadingView.vue'),
      meta: { hideTabBar: true }
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
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/ErrorVIew.vue'),
      props: { 
        title: 'Что-то пошло не так.', 
        message: 'Пожалуйста, зайдите в приложение заного.' 
      }
    }
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = useAuthStore().isAuth;
  console.log(isAuthenticated)

  if (to.path != "/" && to.name != "NotFound" && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router
