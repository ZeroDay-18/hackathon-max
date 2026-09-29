<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { profileApi } from '@/services/api.js';
import { useAuthStore } from '@/stores/auth.store.js';
import { useAppearanceStore } from '@/stores/appearance.store.js';

const router = useRouter();
const authStore = useAuthStore();
const appearanceStore = useAppearanceStore();
const selectedMode = ref(authStore.user?.preferences?.interfaceMode || 'ru-serious');
const isSaving = ref(false);
const error = ref('');

async function continueToApp() {
  isSaving.value = true;
  error.value = '';

  try {
    const response = await profileApi.updatePreferences({
      interfaceMode: selectedMode.value,
      completeOnboarding: true,
    });
    const user = {
      ...authStore.user,
      preferences: response.preferences,
    };
    authStore.updateUser(user);
    appearanceStore.applyLocale(response.preferences.interfaceMode);
    router.replace({ name: 'dashboard' });
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <main class="onboarding-page">
    <div class="onboarding-stars" aria-hidden="true" />
    <section class="onboarding-card">
      <div class="brand-mark"><span class="material-symbols-outlined text-[30px]" aria-hidden="true">palette</span></div>
      <p class="mt-6 text-sm text-[#bacce9]">Шаг 2 из 2</p>
      <h1 class="mt-1 text-[25px] font-black tracking-tight text-white">Выберите стиль</h1>
      <p class="mt-2 text-sm leading-6 text-[#c7d4ec]">Функции останутся одинаковыми. Поменяются только язык интерфейса и настроение.</p>

      <div class="mt-7 grid gap-3">
        <button type="button" class="style-choice" :class="{ 'is-selected': selectedMode === 'ru-serious' }" :aria-pressed="selectedMode === 'ru-serious'" @click="selectedMode = 'ru-serious'">
          <span class="material-symbols-outlined style-choice__icon" aria-hidden="true">school</span>
          <span><strong>Серьёзный</strong><small>Задания, группа, учебный прогресс</small></span>
          <span class="material-symbols-outlined style-choice__check" aria-hidden="true">check_circle</span>
        </button>
        <button type="button" class="style-choice style-choice--game" :class="{ 'is-selected': selectedMode === 'ru-game' }" :aria-pressed="selectedMode === 'ru-game'" @click="selectedMode = 'ru-game'">
          <span class="material-symbols-outlined style-choice__icon" aria-hidden="true">swords</span>
          <span><strong>Игровой</strong><small>Квесты, гильдия, путь героя</small></span>
          <span class="material-symbols-outlined style-choice__check" aria-hidden="true">check_circle</span>
        </button>
      </div>
      <p v-if="error" class="mt-4 rounded-xl bg-[#4b2139] p-3 text-sm text-[#ffd4df]" role="alert">{{ error }}</p>
      <div class="onboarding-steps mt-8"><span /><span class="is-active" /><span /></div>
      <button type="button" class="onboarding-primary mt-6 w-full" :disabled="isSaving" @click="continueToApp">{{ isSaving ? 'Сохраняем…' : 'Продолжить' }}</button>
    </section>
  </main>
</template>
