<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { profileApi } from '@/services/api.js';
import { useAuthStore } from '@/stores/auth.store.js';
import { useAppearanceStore } from '@/stores/appearance.store.js';

const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();
const appearanceStore = useAppearanceStore();
const isSaving = ref(false);
const error = ref('');

async function selectMode(mode) {
  if (mode === appearanceStore.locale || isSaving.value) return;
  isSaving.value = true;
  error.value = '';
  try {
    const response = await profileApi.updatePreferences({ interfaceMode: mode });
    authStore.updateUser({ ...authStore.user, preferences: response.preferences });
    appearanceStore.applyLocale(response.preferences.interfaceMode);
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <main class="quest-page">
    <header class="settings-header">
      <button type="button" class="settings-back" :aria-label="t('common.back')" @click="router.replace({ name: 'dashboard' })"><span class="material-symbols-outlined" aria-hidden="true">arrow_back</span></button>
      <div><p class="text-xs font-semibold text-[#b7a4ff]">StudyQuest</p><h1 class="mt-1 text-[20px] font-extrabold text-white">{{ t('settings.title') }}</h1></div>
    </header>

    <div class="space-y-4 px-4">
      <section class="paper-card p-4">
        <div class="flex items-center gap-2 text-white"><span class="material-symbols-outlined text-[21px] text-[#b9a6ff]" aria-hidden="true">palette</span><div><h2 class="text-[14px] font-extrabold">{{ t('settings.styleTitle') }}</h2><p class="mt-1 text-[12px] text-[#acb9d4]">{{ t('settings.styleHint') }}</p></div></div>
        <div class="mt-4 grid gap-3">
          <button type="button" class="style-choice" :class="{ 'is-selected': appearanceStore.locale === 'ru-serious' }" :aria-pressed="appearanceStore.locale === 'ru-serious'" :disabled="isSaving" @click="selectMode('ru-serious')"><span class="material-symbols-outlined style-choice__icon" aria-hidden="true">school</span><span><strong>{{ t('profile.serious') }}</strong><small>{{ t('settings.seriousHint') }}</small></span><span class="material-symbols-outlined style-choice__check" aria-hidden="true">check_circle</span></button>
          <button type="button" class="style-choice style-choice--game" :class="{ 'is-selected': appearanceStore.locale === 'ru-game' }" :aria-pressed="appearanceStore.locale === 'ru-game'" :disabled="isSaving" @click="selectMode('ru-game')"><span class="material-symbols-outlined style-choice__icon" aria-hidden="true">swords</span><span><strong>{{ t('profile.gamified') }}</strong><small>{{ t('settings.gameHint') }}</small></span><span class="material-symbols-outlined style-choice__check" aria-hidden="true">check_circle</span></button>
        </div>
        <p v-if="error" class="mt-4 rounded-xl bg-[#4b2139] p-3 text-sm text-[#ffd4df]" role="alert">{{ error }}</p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.settings-header { display: flex; align-items: center; gap: 11px; padding: max(22px, env(safe-area-inset-top)) 16px 26px; background: rgb(12 20 40 / 82%); backdrop-filter: blur(14px); }.settings-back { display: grid; width: 40px; height: 40px; flex: none; place-items: center; border: 1px solid rgb(185 199 239 / 18%); border-radius: 13px; color: #d5e0f5; background: rgb(255 255 255 / 6%); }
</style>
