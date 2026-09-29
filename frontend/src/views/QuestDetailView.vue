<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PomodoroTimer from '@/components/PomodoroTimer.vue';
import { useAuthStore } from '@/stores/auth.store.js';
import { useQuestStore } from '@/stores/quest.store.js';
import { formatDeadline, isOverdue, questTypeStyles } from '@/utils/quest.js';

const route = useRoute(); const router = useRouter(); const { t } = useI18n(); const authStore = useAuthStore(); const questStore = useQuestStore();
const quest = ref(null); const error = ref(''); const isSaving = ref(false); const notice = ref('');
const isDone = computed(() => Boolean(quest.value?.progress?.completedAt));
const isCreator = computed(() => Number(quest.value?.creatorId) === Number(authStore.user?.id));
const typeStyle = computed(() => questTypeStyles[quest.value?.type] || questTypeStyles.homework);
const deadlineText = computed(() => formatDeadline(quest.value?.deadline));
async function load() { error.value = ''; try { quest.value = await questStore.loadQuest(route.params.id); } catch (requestError) { error.value = requestError.message; } }
async function toggleComplete() { if (!quest.value) return; isSaving.value = true; try { const response = await questStore.setCompleted(quest.value.id, !isDone.value); quest.value.progress = response.progress; if (response.xpAwarded) {
      router.replace({ name: 'quest-reward', params: { id: quest.value.id }, query: { xp: response.xpAwarded } });
      return;
    } } catch (requestError) { error.value = requestError.message; } finally { isSaving.value = false; } }
async function onPomodoroComplete() { if (!quest.value) return; try { const progress = await questStore.completePomodoro(quest.value.id); quest.value.progress = progress; notice.value = t('timer.completed'); } catch (requestError) { error.value = requestError.message; } }
async function removeQuest() { if (!quest.value || !window.confirm(t('quests.deleteConfirm'))) return; try { await questStore.deleteQuest(quest.value.id); router.replace({ name: 'quests' }); } catch (requestError) { error.value = requestError.message; } }
onMounted(load);
</script>

<template>
  <main class="quest-page quest-page--plain"><header class="flex items-center justify-between"><button type="button" class="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white" :aria-label="t('common.back')" @click="router.back()"><span class="material-symbols-outlined" aria-hidden="true">arrow_back</span></button><h1 class="text-[15px] font-bold text-white">{{ t('quests.detail') }}</h1><button v-if="isCreator" type="button" class="grid h-9 w-9 place-items-center rounded-lg bg-[#4c233b] text-[#ffb5c4]" :aria-label="t('quests.delete')" @click="removeQuest"><span class="material-symbols-outlined" aria-hidden="true">delete</span></button><span v-else class="h-9 w-9" /></header>
    <p v-if="error" class="paper-card mt-6 p-4 text-sm text-[#ffb6c3]">{{ error }} <button type="button" class="ml-2 underline" @click="load">{{ t('common.retry') }}</button></p><p v-else-if="!quest" class="py-16 text-center text-sm text-[#b3c0da]">{{ t('common.loading') }}</p>
    <template v-else><section class="relative mt-5 overflow-hidden rounded-[20px] border border-[#785bd6]/50 bg-[#2d246f] p-5 shadow-[0_14px_30px_#080c205e]"><div class="absolute inset-0 bg-[url('/realm.svg')] bg-cover bg-center opacity-20" /><div class="relative"><span class="material-symbols-outlined grid h-15 w-15 place-items-center rounded-2xl border border-white/30 bg-white/15 text-[30px] text-white" aria-hidden="true">{{ typeStyle.icon }}</span><p class="mt-4 text-xs font-semibold text-[#d6c8ff]">{{ quest.subject || t(`quests.types.${quest.type}`) }}</p><h2 class="mt-1 text-[22px] font-extrabold leading-tight text-white">{{ quest.title }}</h2><span class="mt-3 inline-flex rounded-lg bg-[#0b1740]/50 px-2.5 py-1.5 text-xs font-semibold text-[#e2eaff]">{{ quest.group?.name || t('quests.personal') }}</span></div></section>
      <section class="paper-card mt-4 p-4"><h3 class="text-[13px] font-extrabold text-white">{{ t('quests.description') }}</h3><p class="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-[#becae1]">{{ quest.description || '—' }}</p><dl class="mt-4 divide-y divide-white/10 border-t border-white/10"><div class="flex items-center justify-between gap-4 py-3 text-[12px]"><dt class="text-[#aebbd4]">{{ t('quests.deadline') }}</dt><dd class="font-semibold" :class="isOverdue(quest) ? 'text-[#ff9ca8]' : 'text-[#e0e8fa]'">{{ deadlineText || t('common.noDeadline') }}</dd></div><div class="flex items-center justify-between gap-4 py-3 text-[12px]"><dt class="text-[#aebbd4]">{{ t('quests.creator') }}</dt><dd class="text-right font-semibold text-[#e0e8fa]">{{ [quest.creator?.firstName, quest.creator?.lastName].filter(Boolean).join(' ') || '—' }}</dd></div><div class="flex items-center justify-between gap-4 pt-3 text-[12px]"><dt class="text-[#aebbd4]">{{ t('timer.title') }}</dt><dd class="font-semibold text-[#c0adff]">{{ quest.progress?.pomodoroCount || 0 }}</dd></div></dl></section>
      <div class="mt-4"><PomodoroTimer @focus-complete="onPomodoroComplete" /></div><p v-if="notice" class="mt-2 text-center text-sm font-bold text-[#a9f0c2]" role="status">{{ notice }}</p><button type="button" class="quest-action mt-4 w-full px-5 py-3.5 text-sm" :disabled="isSaving" @click="toggleComplete"><span class="material-symbols-outlined" aria-hidden="true">{{ isDone ? 'check_circle' : 'task_alt' }}</span>{{ isDone ? t('quests.reopen') : t('quests.complete') }}</button></template>
  </main>
</template>
