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
const authStore = useAuthStore();
const questStore = useQuestStore();
const statusFilter = ref('active');
const scopeFilter = ref('all');
const typeFilter = ref('all');
const actionError = ref('');
const filteredQuests = computed(() => questStore.quests
  .filter((quest) => statusFilter.value === 'completed' ? Boolean(quest.progress?.completedAt) : !quest.progress?.completedAt)
  .filter((quest) => scopeFilter.value === 'all' || (scopeFilter.value === 'group' ? Boolean(quest.groupId) : !quest.groupId))
  .filter((quest) => typeFilter.value === 'all' || quest.type === typeFilter.value)
  .sort((a, b) => (a.deadline ? new Date(a.deadline) : Infinity) - (b.deadline ? new Date(b.deadline) : Infinity)));
function openQuest(id) { const quest = questStore.quests.find((item) => item.id === id); router.push({ name: quest?.type === 'poll' ? 'poll-detail' : 'quest-detail', params: { id } }); }
async function toggleComplete(quest) { actionError.value = ''; try { await questStore.setCompleted(quest.id, !quest.progress?.completedAt); } catch (error) { actionError.value = error.message; } }
onMounted(() => { if (!questStore.quests.length) questStore.loadQuests(); });
</script>

<template>
  <main class="quest-page">
    <header class="bg-[#101b31] px-4 pb-8 pt-[max(22px,env(safe-area-inset-top))]"><div class="flex items-center gap-3"><button type="button" class="grid h-9 w-9 place-items-center rounded-lg border border-white/12 text-white" aria-label="Назад" @click="router.push({ name: 'dashboard' })"><span class="material-symbols-outlined" aria-hidden="true">arrow_back</span></button><div class="min-w-0 flex-1"><h1 class="text-[19px] font-extrabold text-white">{{ t('quests.title') }}</h1><p class="mt-0.5 truncate text-xs text-[#aab8d3]">{{ authStore.user?.group?.name }}</p></div><button type="button" class="grid h-9 w-9 place-items-center rounded-lg bg-[#6247d5] text-white" :aria-label="t('quests.create')" @click="router.push({ name: 'quest-create' })"><span class="material-symbols-outlined" aria-hidden="true">add</span></button></div></header>
    <div class="relative -mt-4 px-4"><section class="paper-card p-2"><div class="grid grid-cols-2 gap-1 rounded-xl bg-[#090f21]/55 p-1"><button v-for="status in ['active', 'completed']" :key="status" type="button" class="rounded-lg px-3 py-2.5 text-[12px] font-bold transition" :class="statusFilter === status ? 'bg-[#644bd4] text-white shadow-lg' : 'text-[#aab8d3]'" :aria-pressed="statusFilter === status" @click="statusFilter = status">{{ t(`quests.${status}`) }} ({{ status === 'active' ? questStore.activeQuests.length : questStore.completedQuests.length }})</button></div></section>
      <div class="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1"><button v-for="scope in ['all','group','personal']" :key="scope" type="button" class="shrink-0 rounded-lg border px-3 py-1.5 text-[11px] font-semibold" :class="scopeFilter === scope ? 'border-[#8d70eb] bg-[#403172] text-white' : 'border-white/10 bg-white/5 text-[#abb9d3]'" @click="scopeFilter = scope">{{ t(`quests.${scope === 'all' ? 'allScopes' : `${scope}Scope`}`) }}</button></div>
      <div class="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1"><button type="button" class="shrink-0 rounded-lg border px-3 py-1.5 text-[11px] font-semibold" :class="typeFilter === 'all' ? 'border-[#8d70eb] bg-[#403172] text-white' : 'border-white/10 bg-white/5 text-[#abb9d3]'" @click="typeFilter = 'all'">{{ t('quests.allTypes') }}</button><button v-for="type in questTypes" :key="type" type="button" class="shrink-0 rounded-lg border px-3 py-1.5 text-[11px] font-semibold" :class="typeFilter === type ? 'border-[#8d70eb] bg-[#403172] text-white' : 'border-white/10 bg-white/5 text-[#abb9d3]'" @click="typeFilter = type">{{ t(`quests.types.${type}`) }}</button></div>
      <section class="mt-5"><p v-if="questStore.isLoading" class="paper-card p-8 text-center text-sm text-[#b3c0da]">{{ t('common.loading') }}</p><div v-else-if="questStore.error || actionError" class="paper-card p-4 text-sm text-[#ffbac5]">{{ questStore.error || actionError }} <button type="button" class="ml-2 underline" @click="questStore.loadQuests">{{ t('common.retry') }}</button></div><div v-else-if="filteredQuests.length" class="space-y-2.5"><QuestCard v-for="quest in filteredQuests" :key="quest.id" :quest="quest" @open="openQuest" @toggle-complete="toggleComplete" /></div><div v-else class="paper-card p-9 text-center text-sm text-[#b1bfda]"><span class="material-symbols-outlined text-[38px] text-[#b6a2ff]" aria-hidden="true">auto_stories</span><p class="mt-2">{{ t('quests.empty') }}</p></div></section>
    </div>
  </main>
</template>
