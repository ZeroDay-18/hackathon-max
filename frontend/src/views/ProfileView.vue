<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AvatarFrame from '@/components/AvatarFrame.vue';
import { profileApi } from '@/services/api.js';
import { useAuthStore } from '@/stores/auth.store.js';
import { useAppearanceStore } from '@/stores/appearance.store.js';
import { usePlayerStore } from '@/stores/player.store.js';

const { t } = useI18n();
const authStore = useAuthStore();
const appearanceStore = useAppearanceStore();
const playerStore = usePlayerStore();
const isSaving = ref(false);
const error = ref('');
const fullName = computed(() => [authStore.user?.firstName, authStore.user?.lastName].filter(Boolean).join(' '));
const progression = computed(() => playerStore.progression);

async function changeMode(mode) {
  if (mode === appearanceStore.locale || isSaving.value) return;
  isSaving.value = true;
  error.value = '';
  try {
    const response = await profileApi.updatePreferences({ interfaceMode: mode });
    authStore.updateUser({ ...authStore.user, preferences: response.preferences });
    appearanceStore.applyLocale(mode);
  } catch (requestError) { error.value = requestError.message; } finally { isSaving.value = false; }
}
</script>

<template>
  <main class="quest-page">
    <header class="bg-[#101b31]/75 px-4 backdrop-blur-md pb-9 pt-[max(22px,env(safe-area-inset-top))]"><p class="text-xs font-semibold text-[#b7a4ff]">StudyQuest</p><h1 class="mt-1 text-[20px] font-extrabold text-white">{{ t('profile.title') }}</h1></header>
    <div class="relative -mt-5 space-y-4 px-4">
      <section class="paper-card flex items-center gap-4 p-4"><AvatarFrame :name="fullName" :seed="authStore.user?.avatarSeed || authStore.user?.maxId" class="h-[68px] w-[68px] text-2xl" /><div class="min-w-0"><h2 class="truncate text-[16px] font-extrabold text-white">{{ fullName }}</h2><p class="mt-1 text-[12px] text-[#abb9d2]">{{ t('profile.group') }}: {{ authStore.user?.group?.name || '—' }}</p></div></section>
      <section v-if="progression" class="paper-card p-4"><div class="flex items-center justify-between"><div><p class="text-[12px] text-[#acb9d4]">Ваш прогресс</p><p class="mt-1 text-xl font-black text-white">Уровень {{ progression.level }}</p></div><span class="rounded-xl bg-[#3c2d79] px-3 py-2 text-sm font-extrabold text-[#d0c2ff]">{{ progression.xp }} XP</span></div><div class="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><div class="rounded-xl bg-white/5 p-2"><span class="block font-bold text-[#96cfff]">INT</span><span class="mt-1 block text-base font-black text-white">{{ progression.stats.intelligence }}</span></div><div class="rounded-xl bg-white/5 p-2"><span class="block font-bold text-[#8ce1b5]">END</span><span class="mt-1 block text-base font-black text-white">{{ progression.stats.endurance }}</span></div><div class="rounded-xl bg-white/5 p-2"><span class="block font-bold text-[#ffd07d]">REP</span><span class="mt-1 block text-base font-black text-white">{{ progression.stats.reputation }}</span></div></div></section>
      <section class="paper-card p-4"><div class="flex items-center gap-2 text-white"><span class="material-symbols-outlined text-[21px] text-[#b9a6ff]" aria-hidden="true">tune</span><h2 class="text-[14px] font-extrabold">{{ t('profile.languageMode') }}</h2></div><div class="mt-4 grid grid-cols-2 gap-2"><button v-for="mode in ['ru-serious', 'ru-game']" :key="mode" type="button" class="rounded-xl border px-3 py-3 text-sm font-bold transition" :class="appearanceStore.locale === mode ? 'border-[#9677f3] bg-[#453578] text-white' : 'border-white/10 bg-white/5 text-[#adbad5]'" :aria-pressed="appearanceStore.locale === mode" :disabled="isSaving" @click="changeMode(mode)">{{ t(`profile.${mode === 'ru-serious' ? 'serious' : 'gamified'}`) }}</button></div><p v-if="error" class="mt-3 text-sm text-[#ffb6c2]">{{ error }}</p></section>
    </div>
  </main>
</template>
