<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store.js';
import { usePlayerStore } from '@/stores/player.store.js';

const router = useRouter();
const authStore = useAuthStore();
const playerStore = usePlayerStore();
const statusMessage = ref('Подключаем StudyQuest…');
const authError = ref(null);
const isRetrying = ref(false);

async function boot() {
  isRetrying.value = true;
  authError.value = null;
  statusMessage.value = 'Проверяем доступ…';

  const initData = window.WebApp?.initData;
  const result = await authStore.authenticateWithMax(initData);

  if (!result.success) {
    authError.value = result;
    statusMessage.value = result.code === 'USER_NOT_REGISTERED'
      ? 'Сначала нужно зарегистрироваться в боте.'
      : 'Не удалось войти в приложение.';
    isRetrying.value = false;
    return;
  }

  playerStore.applyProfile({ user: result.user, progression: result.progression });
  const destination = result.user.preferences?.onboardingCompletedAt ? 'dashboard' : 'welcome';
  router.replace({ name: destination });
}

onMounted(boot);
</script>

<template>
  <main class="onboarding-page">
    <div class="onboarding-stars" aria-hidden="true" />
    <section class="onboarding-card text-center">
      <div class="brand-mark mx-auto">
        <span class="material-symbols-outlined text-[33px]" aria-hidden="true">auto_stories</span>
      </div>
      <h1 class="mt-5 text-[27px] font-black tracking-tight text-white">StudyQuest</h1>
      <p class="mt-2 text-sm leading-6 text-[#c8d8f4]">Учёба, которая становится понятнее.</p>

      <template v-if="authError?.code === 'USER_NOT_REGISTERED'">
        <div class="mt-7 rounded-2xl border border-[#9277ed]/40 bg-[#211c4e]/70 p-4 text-left">
          <span class="material-symbols-outlined text-[#c9b9ff]" aria-hidden="true">chat</span>
          <h2 class="mt-2 text-base font-bold text-white">Зарегистрируйтесь в боте</h2>
          <p class="mt-1 text-sm leading-6 text-[#d2c9f3]">Откройте чат с StudyQuest в MAX и отправьте команду <strong>/start</strong>. После регистрации вернитесь сюда.</p>
        </div>
        <button type="button" class="onboarding-primary mt-6 w-full" :disabled="isRetrying" @click="boot">Проверить регистрацию</button>
      </template>
      <template v-else-if="authError">
        <p class="mt-7 rounded-2xl bg-[#4b2139]/70 p-4 text-sm text-[#ffd5e0]">{{ statusMessage }}</p>
        <button type="button" class="onboarding-primary mt-6 w-full" :disabled="isRetrying" @click="boot">Повторить</button>
      </template>
      <template v-else>
        <div class="mt-8 flex items-center justify-center gap-2 text-sm text-[#c9d7ef]">
          <span class="loading-orb" aria-hidden="true" />{{ statusMessage }}
        </div>
      </template>
    </section>
  </main>
</template>
