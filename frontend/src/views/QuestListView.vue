<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import QuestCard from '@/components/QuestCard.vue';
import { useAuthStore } from '@/stores/auth.store.js';
import { useQuestStore } from '@/stores/quest.store.js';
import { questTypes } from '@/utils/quest.js';

const router = useRouter();
const { t } = useI18n();
const questStore = useQuestStore();
const authStore = useAuthStore();
const statusFilter = ref('active');
const scopeFilter = ref('all');
const typeFilter = ref('all');
const actionError = ref('');

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
    <header class="bg-[#111d33] px-4 pb-7 pt-[max(22px,env(safe-area-inset-top))] text-white">
      <div class="flex items-center gap-3">
        <button type="button" class="grid h-9 w-9 place-items-center rounded-lg border border-white/15" :aria-label="t('common.back')" @click="router.push({ name: 'dashboard' })">
          <span class="material-symbols-outlined text-xl" aria-hidden="true">arrow_back</span>
        </button>
        <div class="min-w-0 flex-1">
          <h1 class="text-[19px] font-extrabold">{{ t('quests.title') }}</h1>
          <p v-if="authStore.user?.group?.name" class="mt-0.5 truncate text-xs text-[#aab9d8]">{{ authStore.user.group.name }}</p>
        </div>
        <button type="button" class="grid h-9 w-9 place-items-center rounded-lg bg-[#4634ac] text-[#eee9ff]" :aria-label="t('quests.create')" @click="router.push({ name: 'quest-create' })">
          <span class="material-symbols-outlined text-xl" aria-hidden="true">add</span>
        </button>
      </div>
    </header>

    <div class="px-4 pb-6">
      <div class="paper-card relative -mt-4 p-2">
        <div class="grid grid-cols-2 gap-1 rounded-xl bg-[#f0f2f8] p-1">
          <button
            v-for="status in ['active', 'completed']"
            :key="status"
            type="button"
            class="rounded-lg px-3 py-2.5 text-[12px] font-bold transition"
            :class="statusFilter === status ? 'bg-[#5846af] text-white shadow-md' : 'text-[#63718d]'"
            :aria-pressed="statusFilter === status"
            @click="statusFilter = status"
          >
            {{ t(`quests.${status}`) }} ({{ status === 'active' ? questStore.activeQuests.length : questStore.completedQuests.length }})
          </button>
        </div>
      </div>

      <div class="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="scope in ['all', 'group', 'personal']"
          :key="scope"
          type="button"
          class="shrink-0 rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition"
          :class="scopeFilter === scope ? 'border-[#7862dd] bg-[#eae6ff] text-[#4c39a2]' : 'border-[#dce1ed] bg-white text-[#66738e]'"
          :aria-pressed="scopeFilter === scope"
          @click="scopeFilter = scope"
        >{{ t(`quests.${scope === 'all' ? 'allScopes' : `${scope}Scope`}`) }}</button>
      </div>
      <div class="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          class="shrink-0 rounded-lg border px-3 py-1.5 text-[11px] font-semibold"
          :class="typeFilter === 'all' ? 'border-[#7862dd] bg-[#eae6ff] text-[#4c39a2]' : 'border-[#dce1ed] bg-white text-[#66738e]'"
          :aria-pressed="typeFilter === 'all'"
          @click="typeFilter = 'all'"
        >{{ t('quests.allTypes') }}</button>
        <button
          v-for="type in questTypes"
          :key="type"
          type="button"
          class="shrink-0 rounded-lg border px-3 py-1.5 text-[11px] font-semibold"
          :class="typeFilter === type ? 'border-[#7862dd] bg-[#eae6ff] text-[#4c39a2]' : 'border-[#dce1ed] bg-white text-[#66738e]'"
          :aria-pressed="typeFilter === type"
          @click="typeFilter = type"
        >{{ t(`quests.types.${type}`) }}</button>
      </div>

      <section class="mt-5" :aria-label="t('quests.title')">
        <p v-if="questStore.isLoading" class="paper-card p-8 text-center text-sm text-[#697691]">{{ t('common.loading') }}</p>
        <div v-else-if="questStore.error || actionError" class="paper-card p-4 text-sm text-[#b8374b]">
          {{ questStore.error || actionError }}
          <button type="button" class="ml-2 underline" @click="questStore.loadQuests">{{ t('common.retry') }}</button>
        </div>
        <div v-else-if="filteredQuests.length" class="space-y-2.5">
          <QuestCard v-for="quest in filteredQuests" :key="quest.id" :quest="quest" @open="openQuest" @toggle-complete="toggleComplete" />
        </div>
        <div v-else class="paper-card p-9 text-center">
          <span class="material-symbols-outlined text-[38px] text-[#7862d2]" aria-hidden="true">auto_stories</span>
          <p class="mt-2 text-sm text-[#697691]">{{ t('quests.empty') }}</p>
        </div>
      </section>

      <button type="button" class="quest-action mt-5 w-full px-4 py-3 text-sm" @click="router.push({ name: 'quest-create' })">
        <span class="material-symbols-outlined text-lg" aria-hidden="true">add</span>{{ t('quests.create') }}
      </button>
    </div>
  </main>
</template>
