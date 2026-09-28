<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-[#070913] transition-colors duration-300">
    <div class="relative flex items-center justify-center">

      <span class="material-symbols-outlined animate-spin text-5xl text-purple-600 dark:text-purple-500 select-none relative z-10">
        progress_activity
      </span>

      <div class="absolute inset-0 rounded-full shadow-[0_0_25px_rgba(124,58,237,0.5)] dark:block hidden pointer-events-none"></div>

    </div>
    <p class="text-violet-600 dark:text-violet-300 text-xs mt-4">{{ statusMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store.js';

const router = useRouter();
const authStore = useAuthStore();
const statusMessage = ref('Загружаем приложение...');

onMounted(async () => {
  try {
    // Получаем initData из MAX SDK
    const initData = window.Telegram?.WebApp?.initData || window.MAX?.initData;

    if (!initData) {
      statusMessage.value = 'Ошибка: данные авторизации не найдены';
      setTimeout(() => {
        router.push({ name: 'NotFound', params: { pathMatch: ['auth-error'] } });
      }, 2000);
      return;
    }

    statusMessage.value = 'Авторизация...';
    const result = await authStore.authenticateWithMax(initData);

    if (result.success) {
      statusMessage.value = 'Успешно!';
      setTimeout(() => {
        router.push({ name: 'main' });
      }, 500);
    } else {
      statusMessage.value = `Ошибка: ${result.error}`;
      setTimeout(() => {
        router.push({ name: 'NotFound', params: { pathMatch: ['auth-failed'] } });
      }, 2000);
    }
  } catch (error) {
    console.error('Loading error:', error);
    statusMessage.value = 'Произошла ошибка';
    setTimeout(() => {
      router.push({ name: 'NotFound', params: { pathMatch: ['error'] } });
    }, 2000);
  }
});
</script>