<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AvatarFrame from '@/components/AvatarFrame.vue';
import PlayerStatsGrid from '@/components/PlayerStatsGrid.vue';
import QuestCard from '@/components/QuestCard.vue';
import { useAuthStore } from '@/stores/auth.store.js';
import { usePlayerStore } from '@/stores/player.store.js';
import { useQuestStore } from '@/stores/quest.store.js';
import { formatDeadline, isOverdue, questTypeStyles } from '@/utils/quest.js';

const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();
const playerStore = usePlayerStore();
const questStore = useQuestStore();
const actionError = ref('');

const upcomingQuests = computed(() => [...questStore.activeQuests]
  .sort((a, b) => (a.deadline ? new Date(a.deadline) : Infinity) - (b.deadline ? new Date(b.deadline) : Infinity))
  .slice(0, 3));
const nearestQuest = computed(() => upcomingQuests.value.find((quest) => quest.deadline));
const fullName = computed(() => [authStore.user?.firstName, authStore.user?.lastName].filter(Boolean).join(' '));
const nearestStyle = computed(() => questTypeStyles[nearestQuest.value?.type] || questTypeStyles.homework);
const progression = computed(() => playerStore.progression || { xp: 0, level: 1, xpIntoLevel: 0, xpForNextLevel: 100, progressPercent: 0 });

function openQuest(questId) {
  const quest = questStore.quests.find((item) => item.id === questId);
  router.push({ name: quest?.type === 'poll' ? 'poll-detail' : 'quest-detail', params: { id: questId } });
}

async function toggleComplete(quest) {
  actionError.value = '';
  try {
    await questStore.setCompleted(quest.id, !quest.progress?.completedAt);
  } catch (error) {
    actionError.value = error.message;
  }
}

onMounted(async () => {
  if (!playerStore.isLoaded) await playerStore.loadProfile().catch(() => {});
  if (!questStore.quests.length) questStore.loadQuests();
});
</script>

<template>
  <main class="quest-page">
    <section class="quest-hero">
      <header class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <span class="brand-mark !h-10 !w-10 !rounded-xl"><span class="material-symbols-outlined text-[23px]" aria-hidden="true">auto_stories</span></span>
          <div><p class="text-[19px] font-black leading-5">StudyQuest<span class="text-[#ffde85]">✦</span></p><p class="mt-1 text-[10px] text-[#d3e2fb]">Твои учебные квесты в MAX</p></div>
        </div>
        <div class="flex gap-2">
          <button type="button" class="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-[#071a37]/55 text-white" aria-label="Уведомления" @click="router.push({ name: 'notifications' })"><span class="material-symbols-outlined text-[20px]" aria-hidden="true">notifications</span></button>
          <button type="button" class="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-[#071a37]/55 text-white" :aria-label="t('settings.title')" @click="router.push({ name: 'settings' })"><span class="material-symbols-outlined text-[20px]" aria-hidden="true">settings</span></button>
        </div>
      </header>

      <div class="mt-8 flex items-center gap-4">
        <AvatarFrame :name="fullName" :seed="authStore.user?.avatarSeed || authStore.user?.maxId" class="h-[72px] w-[72px] text-3xl" />
        <div class="min-w-0 flex-1 drop-shadow-md">
          <h1 class="truncate text-[20px] font-extrabold">{{ fullName }}</h1>
          <p class="mt-1 text-xs text-[#e1ebff]">{{ t('profile.group') }} · {{ authStore.user?.group?.name || '—' }}</p>
          <div class="mt-3 flex items-center gap-2 text-xs"><span class="font-bold text-white">Уровень {{ progression.level }}</span><span class="ml-auto font-bold text-[#d7caff]">{{ progression.xp }} / {{ progression.nextLevelXp }} XP</span></div>
          <div class="mt-1.5 h-2.5 overflow-hidden rounded-full border border-white/15 bg-[#071731]/65"><div class="h-full rounded-full bg-gradient-to-r from-[#5ccfff] via-[#7186ff] to-[#bf87ff] shadow-[0_0_12px_#8e8cff]" :style="{ width: `${progression.progressPercent}%` }" /></div>
        </div>
      </div>

      <div class="mt-7"><PlayerStatsGrid :progression="progression" /></div>
    </section>

    <div class="relative -mt-11 space-y-4 px-4">
      <button type="button" class="paper-card flex w-full items-center gap-3 p-3 text-left" @click="router.push({ name: 'guild' })">
        <span class="material-symbols-outlined grid h-12 w-12 place-items-center rounded-xl bg-[#272354] text-[25px] text-[#b9a2ff]" aria-hidden="true">shield</span>
        <span class="min-w-0 flex-1"><span class="block truncate text-[15px] font-extrabold text-white">{{ authStore.user?.group?.name || '—' }}</span><span class="text-xs text-[#b4c1dd]">{{ t('nav.groups') }}</span></span>
        <span class="material-symbols-outlined text-[#9cabc8]" aria-hidden="true">chevron_right</span>
      </button>

      <section v-if="nearestQuest" class="paper-card p-4">
        <div class="mb-3 flex items-center justify-between"><h2 class="text-[13px] font-extrabold text-white">{{ t('dashboard.nextDeadline') }}</h2><span v-if="isOverdue(nearestQuest)" class="text-xs font-bold text-[#ff9ba8]">{{ t('common.overdue') }}</span></div>
        <button type="button" class="paper-subtle flex w-full items-center gap-3 p-3 text-left" @click="openQuest(nearestQuest.id)">
          <span class="material-symbols-outlined grid h-12 w-12 place-items-center rounded-xl text-[25px] ring-1" :class="nearestStyle.color" aria-hidden="true">{{ nearestStyle.icon }}</span>
          <span class="min-w-0 flex-1"><span class="block truncate text-[14px] font-bold text-white">{{ nearestQuest.title }}</span><span class="block pt-1 text-xs text-[#abb9d3]">{{ t(`quests.types.${nearestQuest.type}`) }}</span><span class="mt-2 flex items-center gap-1 text-xs font-bold" :class="isOverdue(nearestQuest) ? 'text-[#ff9ba8]' : 'text-[#c0abff]'"> <span class="material-symbols-outlined text-sm" aria-hidden="true">schedule</span>{{ formatDeadline(nearestQuest.deadline) }}</span></span>
          <span class="material-symbols-outlined text-[#9dabc5]" aria-hidden="true">chevron_right</span>
        </button>
      </section>

      <section>
        <div class="mb-3 flex items-center justify-between px-1"><h2 class="text-[16px] font-extrabold text-white">{{ t('dashboard.active') }}</h2><button type="button" class="text-xs font-bold text-[#bca9ff]" @click="router.push({ name: 'quests' })">{{ t('dashboard.seeAll') }}</button></div>
        <p v-if="questStore.isLoading" class="paper-card p-8 text-center text-sm text-[#b1bfda]">{{ t('common.loading') }}</p>
        <div v-else-if="questStore.error || actionError" class="paper-card p-4 text-sm text-[#ffbac4]">{{ questStore.error || actionError }} <button type="button" class="ml-2 underline" @click="questStore.loadQuests">{{ t('common.retry') }}</button></div>
        <div v-else-if="upcomingQuests.length" class="space-y-2.5"><QuestCard v-for="quest in upcomingQuests" :key="quest.id" :quest="quest" @open="openQuest" @toggle-complete="toggleComplete" /></div>
        <div v-else class="paper-card p-7 text-center text-sm text-[#b1bfda]">{{ t('dashboard.empty') }}</div>
      </section>
    </div>
  </main>
</template>
