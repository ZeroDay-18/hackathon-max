<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import QuestCard from '@/components/QuestCard.vue';
import { useQuestStore } from '@/stores/quest.store.js';
import { questTypes } from '@/utils/quest.js';

const router = useRouter();
const { t } = useI18n();
const questStore = useQuestStore();
const statusFilter = ref('active');
const scopeFilter = ref('all');
const typeFilter = ref('all');

const filteredQuests = computed(() =>
  questStore.quests
    .filter((quest) => statusFilter.value === 'completed' ? Boolean(quest.progress?.completedAt) : !quest.progress?.completedAt)
    .filter((quest) => scopeFilter.value === 'all' || (scopeFilter.value === 'group' ? Boolean(quest.groupId) : !quest.groupId))
    .filter((quest) => typeFilter.value === 'all' || quest.type === typeFilter.value)
    .sort((first, second) => {
      if (!first.deadline) return 1;
      if (!second.deadline) return -1;
      return new Date(first.deadline) - new Date(second.deadline);
    }),
);

function openQuest(id) {
  router.push({ name: 'quest-detail', params: { id } });
}

async function toggleComplete(quest) {
  await questStore.setCompleted(quest.id, !quest.progress?.completedAt);
}

onMounted(() => {
  if (!questStore.quests.length) questStore.loadQuests();
});
</script>

<template>
  <main class="mx-auto min-h-dvh max-w-md bg-[#070913] px-4 pb-28 pt-[max(1rem,env(safe-area-inset-top))] text-slate-100">
    <header class="flex items-center justify-between gap-4">
      <div>
        <p class="text-sm text-violet-300">StudyQuest</p>
        <h1 class="mt-1 text-2xl font-bold text-white">{{ t('quests.title') }}</h1>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-1 rounded-2xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400"
        @click="router.push({ name: 'quest-create' })"
      >
        <span class="material-symbols-outlined text-lg">add</span>
        {{ t('quests.create') }}
      </button>
    </header>

    <section class="mt-6 space-y-3">
      <div class="flex gap-2 rounded-2xl bg-white/5 p-1">
        <button
          v-for="status in ['active', 'completed']"
          :key="status"
          type="button"
          class="flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition"
          :class="statusFilter === status ? 'bg-violet-500 text-white' : 'text-slate-400'"
          @click="statusFilter = status"
        >
          {{ t(`quests.${status}`) }}
        </button>
      </div>

      <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          v-for="scope in ['all', 'group', 'personal']"
          :key="scope"
          type="button"
          class="shrink-0 rounded-full border px-3 py-1.5 text-xs transition"
          :class="scopeFilter === scope ? 'border-violet-400 bg-violet-500/20 text-violet-100' : 'border-white/10 text-slate-400'"
          @click="scopeFilter = scope"
        >
          {{ t(`quests.${scope === 'all' ? 'allScopes' : `${scope}Scope`}`) }}
        </button>
      </div>

      <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          class="shrink-0 rounded-full border px-3 py-1.5 text-xs transition"
          :class="typeFilter === 'all' ? 'border-violet-400 bg-violet-500/20 text-violet-100' : 'border-white/10 text-slate-400'"
          @click="typeFilter = 'all'"
        >
          {{ t('quests.allScopes') }}
        </button>
        <button
          v-for="type in questTypes"
          :key="type"
          type="button"
          class="shrink-0 rounded-full border px-3 py-1.5 text-xs transition"
          :class="typeFilter === type ? 'border-violet-400 bg-violet-500/20 text-violet-100' : 'border-white/10 text-slate-400'"
          @click="typeFilter = type"
        >
          {{ t(`quests.types.${type}`) }}
        </button>
      </div>
    </section>

    <section class="mt-5">
      <p v-if="questStore.isLoading" class="py-10 text-center text-sm text-slate-400">{{ t('common.loading') }}</p>
      <div v-else-if="questStore.error" class="rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-200">
        {{ questStore.error }}
        <button type="button" class="ml-2 underline" @click="questStore.loadQuests">{{ t('common.retry') }}</button>
      </div>
      <div v-else-if="filteredQuests.length" class="space-y-3">
        <QuestCard
          v-for="quest in filteredQuests"
          :key="quest.id"
          :quest="quest"
          @open="openQuest"
          @toggle-complete="toggleComplete"
        />
      </div>
      <div v-else class="rounded-3xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-400">
        {{ t('quests.empty') }}
      </div>
    </section>
  </main>
</template>
