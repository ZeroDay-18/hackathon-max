<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import QuestCard from '@/components/QuestCard.vue';
import { useAuthStore } from '@/stores/auth.store.js';
import { useQuestStore } from '@/stores/quest.store.js';

const router = useRouter(); const { t } = useI18n(); const authStore = useAuthStore(); const questStore = useQuestStore(); const actionError = ref('');
const groupQuests = computed(() => questStore.quests.filter((quest) => quest.groupId === authStore.user?.group?.id));
function openQuest(id) { const quest = questStore.quests.find((item) => item.id === id); router.push({ name: quest?.type === 'poll' ? 'poll-detail' : 'quest-detail', params: { id } }); }
async function toggleComplete(quest) { actionError.value = ''; try { await questStore.setCompleted(quest.id, !quest.progress?.completedAt); } catch (error) { actionError.value = error.message; } }
onMounted(() => { if (!questStore.quests.length) questStore.loadQuests(); });
</script>

<template>
  <main class="quest-page"><header class="bg-[#101b31] px-4 pb-9 pt-[max(22px,env(safe-area-inset-top))]"><div class="flex items-center gap-3"><span class="material-symbols-outlined grid h-12 w-12 place-items-center rounded-xl border border-[#9b88dc] bg-[#49399f] text-[27px] text-[#e3d6ff]" aria-hidden="true">shield</span><div class="min-w-0"><p class="text-xs font-semibold text-[#bcaef4]">{{ t('guild.title') }}</p><h1 class="truncate text-xl font-extrabold text-white">{{ authStore.user?.group?.name || '—' }}</h1></div></div></header><div class="relative -mt-5 space-y-4 px-4"><section class="paper-card flex items-center justify-between p-4"><div><h2 class="text-[15px] font-extrabold text-white">{{ t('guild.shared') }}</h2><p class="mt-1 text-xs text-[#b3c0da]">{{ authStore.user?.group?.name }}</p></div><span class="rounded-xl bg-[#3c2d79] px-3 py-2 text-sm font-extrabold text-[#d0c2ff]">{{ groupQuests.length }}</span></section><p v-if="questStore.isLoading" class="paper-card p-7 text-center text-sm text-[#b4c0d9]">{{ t('common.loading') }}</p><div v-else-if="questStore.error || actionError" class="paper-card p-4 text-sm text-[#ffbac5]">{{ questStore.error || actionError }} <button type="button" class="ml-2 underline" @click="questStore.loadQuests">{{ t('common.retry') }}</button></div><div v-else-if="groupQuests.length" class="space-y-2.5"><QuestCard v-for="quest in groupQuests" :key="quest.id" :quest="quest" @open="openQuest" @toggle-complete="toggleComplete" /></div><p v-else class="paper-card p-8 text-center text-sm text-[#b4c0d9]">{{ t('guild.empty') }}</p><button type="button" class="quest-action w-full px-4 py-3 text-sm" @click="router.push({ name: 'quest-create' })"><span class="material-symbols-outlined" aria-hidden="true">add</span>{{ t('quests.create') }}</button></div></main>
</template>
