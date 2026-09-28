<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AvatarFrame from '@/components/AvatarFrame.vue';
import QuestCard from '@/components/QuestCard.vue';
import { useAuthStore } from '@/stores/auth.store.js';
import { useQuestStore } from '@/stores/quest.store.js';
import { formatDeadline, isOverdue, questTypeStyles } from '@/utils/quest.js';

const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();
const questStore = useQuestStore();
const actionError = ref('');

const upcomingQuests = computed(() =>
  [...questStore.activeQuests]
    .sort((first, second) => {
      if (!first.deadline) return 1;
      if (!second.deadline) return -1;
      return new Date(first.deadline) - new Date(second.deadline);
    })
    .slice(0, 3),
);

const nearestQuest = computed(() => upcomingQuests.value.find((quest) => quest.deadline));
const greetingName = computed(() => authStore.user?.firstName || '');
const fullName = computed(() => [authStore.user?.firstName, authStore.user?.lastName].filter(Boolean).join(' '));
const nearestStyle = computed(() => questTypeStyles[nearestQuest.value?.type] || questTypeStyles.homework);

function openQuest(id) {
  router.push({ name: 'quest-detail', params: { id } });
}

async function toggleComplete(quest) {
  actionError.value = '';
  try {
    await questStore.setCompleted(quest.id, !quest.progress?.completedAt);
  } catch (error) {
    actionError.value = error.message;
  }
}

onMounted(() => {
  if (!questStore.quests.length) questStore.loadQuests();
});
</script>

<template>
  <main class="quest-page">
    <div class="quest-hero">
      <header class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <span class="grid h-10 w-10 place-items-center rounded-xl border border-white/40 bg-[#4435a1]/90 shadow-[0_3px_0_#24205b]">
            <span class="material-symbols-outlined text-[26px] text-[#fcdf87]" aria-hidden="true">auto_stories</span>
          </span>
          <div>
            <p class="text-[19px] font-black leading-5 tracking-tight text-white">StudyQuest<span class="text-[#ffe08d]">✦</span></p>
            <p class="mt-1 text-[10px] font-medium text-[#d6edff]">{{ t('dashboard.brandSubtitle') }}</p>
          </div>
        </div>
        <button type="button" class="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-[#15294a]/65 backdrop-blur-sm" :aria-label="t('nav.profile')" @click="router.push({ name: 'profile' })">
          <span class="material-symbols-outlined text-[21px]" aria-hidden="true">settings</span>
        </button>
      </header>

      <div class="mt-8 flex items-center gap-4">
        <AvatarFrame :name="fullName" :photo-url="authStore.user?.photoUrl" class="h-[68px] w-[68px] text-3xl" />
        <div class="min-w-0 flex-1 drop-shadow-[0_2px_3px_#13203d]">
          <p class="text-[11px] font-medium text-[#e5ecff]">{{ t('dashboard.greeting', { name: greetingName }) }}</p>
          <h1 class="mt-1 truncate text-[20px] font-extrabold leading-tight">{{ fullName }}</h1>
          <p v-if="authStore.user?.group?.name" class="mt-1 text-xs font-semibold text-[#ecf3ff]">
            {{ t('dashboard.groupLabel') }} · {{ authStore.user.group.name }}
          </p>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap gap-2 text-[11px] font-bold">
        <span class="rounded-lg border border-white/25 bg-[#0c2642]/60 px-3 py-1.5 backdrop-blur-sm">{{ t('dashboard.active') }}: {{ questStore.activeQuests.length }}</span>
        <span class="rounded-lg border border-white/25 bg-[#0c2642]/60 px-3 py-1.5 backdrop-blur-sm">{{ t('dashboard.completed') }}: {{ questStore.completedQuests.length }}</span>
      </div>
    </div>

    <div class="relative -mt-11 space-y-5 px-4">
      <button
        v-if="authStore.user?.group?.name"
        type="button"
        class="paper-card flex w-full items-center gap-3 p-3 text-left transition hover:border-[#ac9bfa]"
        @click="router.push({ name: 'guild' })"
      >
        <span class="material-symbols-outlined grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#182944] text-2xl text-[#d2bbff]" aria-hidden="true">shield</span>
        <span class="min-w-0 flex-1">
          <span class="block truncate text-[15px] font-extrabold text-[#1b2847]">{{ authStore.user.group.name }}</span>
          <span class="text-xs text-[#73809a]">{{ t('dashboard.groupLabel') }}</span>
        </span>
        <span class="material-symbols-outlined text-[20px] text-[#8893ad]" aria-hidden="true">chevron_right</span>
      </button>

      <section v-if="nearestQuest">
        <div class="mb-2.5 flex items-center justify-between px-1">
          <h2 class="text-[14px] font-extrabold text-[#1b2847]">{{ t('dashboard.nextDeadline') }}</h2>
          <span v-if="isOverdue(nearestQuest)" class="text-xs font-bold text-[#d44c58]">{{ t('common.overdue') }}</span>
        </div>
        <button type="button" class="paper-card w-full p-3 text-left transition hover:border-[#a99af2]" @click="openQuest(nearestQuest.id)">
          <span class="paper-subtle flex items-center gap-3 p-3">
            <span class="material-symbols-outlined grid h-12 w-12 shrink-0 place-items-center rounded-xl text-[25px] ring-1" :class="nearestStyle.color" aria-hidden="true">{{ nearestStyle.icon }}</span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-[13px] font-bold text-[#1b2847]">{{ nearestQuest.title }}</span>
              <span class="mt-0.5 block text-xs text-[#73809a]">{{ t(`quests.types.${nearestQuest.type}`) }}</span>
              <span class="mt-2 flex items-center gap-1 text-xs font-bold" :class="isOverdue(nearestQuest) ? 'text-[#d44c58]' : 'text-[#694dd1]'">
                <span class="material-symbols-outlined text-sm" aria-hidden="true">schedule</span>{{ formatDeadline(nearestQuest.deadline) }}
              </span>
            </span>
            <span class="material-symbols-outlined text-[18px] text-[#8690a9]" aria-hidden="true">chevron_right</span>
          </span>
        </button>
      </section>

      <section>
        <div class="mb-3 flex items-center justify-between px-1">
          <h2 class="text-[16px] font-extrabold text-[#1b2847]">{{ t('dashboard.overview') }}</h2>
          <button type="button" class="text-xs font-bold text-[#6648cb]" @click="router.push({ name: 'quests' })">{{ t('dashboard.seeAll') }} →</button>
        </div>
        <p v-if="questStore.isLoading" class="paper-card p-7 text-center text-sm text-[#67738e]">{{ t('common.loading') }}</p>
        <div v-else-if="questStore.error || actionError" class="paper-card p-4 text-sm text-[#b9374a]">
          {{ questStore.error || actionError }}
          <button type="button" class="ml-2 underline" @click="questStore.loadQuests">{{ t('common.retry') }}</button>
        </div>
        <div v-else-if="upcomingQuests.length" class="space-y-2.5">
          <QuestCard v-for="quest in upcomingQuests" :key="quest.id" :quest="quest" @open="openQuest" @toggle-complete="toggleComplete" />
        </div>
        <div v-else class="paper-card p-7 text-center text-sm text-[#67738e]">{{ t('dashboard.empty') }}</div>
        <button type="button" class="quest-action mt-5 w-full px-5 py-3.5 text-sm" @click="router.push({ name: 'quest-create' })">
          <span class="material-symbols-outlined text-lg" aria-hidden="true">add</span>{{ t('dashboard.create') }}
        </button>
      </section>
    </div>
  </main>
</template>
