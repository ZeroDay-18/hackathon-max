<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AvatarFrame from '@/components/AvatarFrame.vue';
import AxolotlMascot from '@/components/AxolotlMascot.vue';
import { useAuthStore } from '@/stores/auth.store.js';
import { usePlayerStore } from '@/stores/player.store.js';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const playerStore = usePlayerStore();
const fullName = computed(() => [authStore.user?.firstName, authStore.user?.lastName].filter(Boolean).join(' '));
const mascotLevel = computed(() => playerStore.progression?.level ?? 1);
</script>

<template>
  <main class="quest-page">
    <header class="bg-[#101b31]/75 px-4 pb-9 pt-[max(22px,env(safe-area-inset-top))] backdrop-blur-md"><p class="text-xs font-semibold text-[#b7a4ff]">StudyQuest</p><h1 class="mt-1 text-[20px] font-extrabold text-white">{{ t('profile.title') }}</h1></header>
    <div class="relative -mt-5 space-y-4 px-4">
      <section class="paper-card flex items-center gap-4 p-4"><AvatarFrame :name="fullName" :seed="authStore.user?.avatarSeed || authStore.user?.maxId" class="h-[68px] w-[68px] text-2xl" /><div class="min-w-0"><h2 class="truncate text-[16px] font-extrabold text-white">{{ fullName }}</h2><p class="mt-1 text-[12px] text-[#abb9d2]">{{ t('profile.group') }}: {{ authStore.user?.group?.name || '—' }}</p></div></section>

      <section class="paper-card overflow-hidden p-3"><div class="px-1 pb-3"><p class="text-[11px] font-semibold uppercase tracking-wide text-[#c8b7ff]">{{ t('profile.mascotEyebrow') }}</p><h2 class="mt-1 text-[17px] font-extrabold text-white">{{ t('profile.mascotTitle') }}</h2><p class="mt-1 text-[12px] leading-relaxed text-[#acb9d4]">{{ t('profile.mascotHint') }}</p></div><AxolotlMascot :level="mascotLevel" /></section>

      <button type="button" class="paper-card flex w-full items-center gap-3 p-4 text-left" @click="router.push({ name: 'emotion-diary' })"><span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#7657e8]/25 text-[#c9b8ff]"><span class="material-symbols-outlined text-[24px]" aria-hidden="true">sentiment_satisfied</span></span><span class="min-w-0 flex-1"><span class="block text-[14px] font-extrabold text-white">{{ t('profile.diaryTitle') }}</span><span class="mt-1 block truncate text-[12px] text-[#abb9d2]">{{ t('profile.diaryHint') }}</span></span><span class="material-symbols-outlined text-[#aebbd7]" aria-hidden="true">chevron_right</span></button>
    </div>
  </main>
</template>
