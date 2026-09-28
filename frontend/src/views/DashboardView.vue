<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import QuestCard from '@/components/QuestCard.vue';
import { useAuthStore } from '@/stores/auth.store.js';
import { useQuestStore } from '@/stores/quest.store.js';
import { isOverdue } from '@/utils/quest.js';

const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();
const questStore = useQuestStore();

const upcomingQuests = computed(() =>
  [...questStore.activeQuests]
    .sort((first, second) => {
      if (!first.deadline) return 1;
      if (!second.deadline) return -1;
      return new Date(first.deadline) - new Date(second.deadline);
    })
    .slice(0, 3),
);

const nearestQuest = computed(() => upcomingQuests.value[0]);
const greetingName = computed(() => authStore.user?.firstName || '');

function openQuest(id) {
  router.push({ name: 'quest-detail', params: { id } });
}

async function toggleComplete(quest) {
  await questStore.setCompleted(quest.id, !quest.progress?.completedAt);
}

onMounted(() => {
  if (!questStore.quests.length) {
    questStore.loadQuests();
  }
});
</script>

<template>
  <main class="mx-auto min-h-dvh max-w-md bg-[#070913] px-4 pb-28 pt-[max(1rem,env(safe-area-inset-top))] text-slate-100">
    <header class="flex items-start justify-between gap-4">
      <div>
        <p class="text-sm text-violet-300">{{ t('dashboard.greeting', { name: greetingName }) }}</p>
        <h1 class="mt-1 text-2xl font-bold tracking-tight text-white">{{ t('dashboard.subtitle') }}</h1>
        <p v-if="authStore.user?.group?.name" class="mt-2 inline-flex rounded-full bg-violet-500/15 px-3 py-1 text-xs font-medium text-violet-200">
          {{ authStore.user.group.name }}
        </p>
      </div>
      <button
        type="button"
        class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/5 text-slate-300 transition hover:bg-white/10"
        :aria-label="t('nav.profile')"
        @click="router.push({ name: 'profile' })"
      >
        <span class="material-symbols-outlined">person</span>
      </button>
    </header>

    <section v-if="nearestQuest" class="mt-7">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-sm font-semibold text-slate-200">{{ t('dashboard.nextDeadline') }}</h2>
        <button type="button" class="text-xs font-medium text-violet-300" @click="router.push({ name: 'quests' })">
          {{ t('dashboard.seeAll') }}
        </button>
      </div>
      <button
        type="button"
        class="w-full rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-indigo-500/10 p-5 text-left shadow-xl shadow-violet-950/30"
        @click="openQuest(nearestQuest.id)"
      >
        <div class="flex items-center justify-between gap-3">
          <span class="material-symbols-outlined rounded-2xl bg-violet-400/15 p-3 text-violet-200">schedule</span>
          <span v-if="isOverdue(nearestQuest)" class="rounded-full bg-rose-400/15 px-2.5 py-1 text-xs font-semibold text-rose-200">{{ t('common.overdue') }}</span>
        </div>
        <p class="mt-5 text-lg font-semibold text-white">{{ nearestQuest.title }}</p>
        <p class="mt-1 text-sm text-slate-300">{{ t(`quests.types.${nearestQuest.type}`) }}</p>
      </button>
    </section>

    <section class="mt-8">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-sm font-semibold text-slate-200">{{ t('dashboard.active') }}</h2>
        <button
          type="button"
          class="grid h-9 w-9 place-items-center rounded-xl bg-violet-500 text-white transition hover:bg-violet-400"
          :aria-label="t('dashboard.create')"
          @click="router.push({ name: 'quest-create' })"
        >
          <span class="material-symbols-outlined">add</span>
        </button>
      </div>

      <p v-if="questStore.isLoading" class="py-8 text-center text-sm text-slate-400">{{ t('common.loading') }}</p>
      <div v-else-if="questStore.error" class="rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-200">
        {{ questStore.error }}
        <button type="button" class="ml-2 underline" @click="questStore.loadQuests">{{ t('common.retry') }}</button>
      </div>
      <div v-else-if="upcomingQuests.length" class="space-y-3">
        <QuestCard
          v-for="quest in upcomingQuests"
          :key="quest.id"
          :quest="quest"
          @open="openQuest"
          @toggle-complete="toggleComplete"
        />
      </div>
      <div v-else class="rounded-3xl border border-dashed border-white/10 p-7 text-center text-sm text-slate-400">
        {{ t('dashboard.empty') }}
      </div>
    </section>
  </main>
</template>
