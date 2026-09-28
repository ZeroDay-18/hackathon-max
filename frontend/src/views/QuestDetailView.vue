<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PomodoroTimer from '@/components/PomodoroTimer.vue';
import { useAuthStore } from '@/stores/auth.store.js';
import { useQuestStore } from '@/stores/quest.store.js';
import { formatDeadline, isOverdue, questTypeStyles } from '@/utils/quest.js';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();
const questStore = useQuestStore();
const quest = ref(null);
const error = ref('');
const isSaving = ref(false);
const notice = ref('');

const isDone = computed(() => Boolean(quest.value?.progress?.completedAt));
const isCreator = computed(() => Number(quest.value?.creatorId) === Number(authStore.user?.id));
const typeStyle = computed(() => questTypeStyles[quest.value?.type] || questTypeStyles.homework);
const deadlineText = computed(() => formatDeadline(quest.value?.deadline));

async function load() {
  error.value = '';
  try {
    quest.value = await questStore.loadQuest(route.params.id);
  } catch (requestError) {
    error.value = requestError.message;
  }
}

async function toggleComplete() {
  if (!quest.value) return;
  isSaving.value = true;
  try {
    const progress = await questStore.setCompleted(quest.value.id, !isDone.value);
    quest.value.progress = progress;
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    isSaving.value = false;
  }
}

async function onPomodoroComplete() {
  if (!quest.value) return;
  try {
    const progress = await questStore.completePomodoro(quest.value.id);
    quest.value.progress = progress;
    notice.value = t('timer.completed');
  } catch (requestError) {
    error.value = requestError.message;
  }
}

async function removeQuest() {
  if (!quest.value || !window.confirm(t('quests.deleteConfirm'))) return;
  try {
    await questStore.deleteQuest(quest.value.id);
    router.replace({ name: 'quests' });
  } catch (requestError) {
    error.value = requestError.message;
  }
}

onMounted(load);
</script>

<template>
  <main class="quest-page quest-page--plain">
    <header class="flex items-center justify-between gap-3">
      <button type="button" class="grid h-9 w-9 place-items-center rounded-lg bg-[#e5e8f2] text-[#253451]" :aria-label="t('common.back')" @click="router.back()">
        <span class="material-symbols-outlined text-xl" aria-hidden="true">arrow_back</span>
      </button>
      <h1 class="text-[15px] font-bold text-[#1b2847]">{{ t('quests.detail') }}</h1>
      <button v-if="isCreator" type="button" class="grid h-9 w-9 place-items-center rounded-lg bg-[#ffe9e9] text-[#b83d4b]" :aria-label="t('quests.delete')" @click="removeQuest">
        <span class="material-symbols-outlined text-xl" aria-hidden="true">delete</span>
      </button>
      <span v-else class="h-9 w-9" />
    </header>

    <div v-if="error" class="paper-card mt-5 p-4 text-sm text-[#b9374a]" role="alert">
      {{ error }}
      <button type="button" class="ml-2 underline" @click="load">{{ t('common.retry') }}</button>
    </div>
    <p v-if="!quest && !error" class="py-16 text-center text-sm text-[#66738e]">{{ t('common.loading') }}</p>

    <template v-if="quest">
      <section class="relative mt-5 overflow-hidden rounded-[18px] bg-[#5033b9] p-5 text-white shadow-[0_7px_18px_#41258a40]">
        <div class="pointer-events-none absolute inset-0 bg-[url('/realm.svg')] bg-cover bg-center opacity-20" />
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#432b9a]/90 to-[#4935a1]/35" />
        <div class="relative">
          <span class="material-symbols-outlined grid h-14 w-14 place-items-center rounded-[15px] border border-white/40 bg-white/20 text-[30px] shadow-lg" aria-hidden="true">{{ typeStyle.icon }}</span>
          <p class="mt-5 text-[11px] font-semibold text-[#ded5ff]">{{ t(`quests.types.${quest.type}`) }}</p>
          <h2 class="mt-1 text-[21px] font-extrabold leading-tight">{{ quest.title }}</h2>
          <span class="mt-4 inline-flex items-center gap-1 rounded-lg bg-[#332276]/60 px-2.5 py-1.5 text-[11px] font-semibold">
            <span class="material-symbols-outlined text-sm" aria-hidden="true">{{ quest.group ? 'shield' : 'person' }}</span>
            {{ quest.group?.name || t('quests.personal') }}
          </span>
        </div>
      </section>

      <section class="paper-card mt-4 p-4">
        <h3 class="text-[13px] font-extrabold text-[#182647]">{{ t('quests.description') }}</h3>
        <p class="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-[#4f5c78]">{{ quest.description || '—' }}</p>
        <dl class="mt-4 divide-y divide-[#e9ecf4] border-t border-[#e9ecf4]">
          <div class="flex items-center justify-between gap-4 py-3 text-[12px]">
            <dt class="font-medium text-[#697691]">{{ t('quests.deadline') }}</dt>
            <dd class="flex items-center gap-1 font-semibold" :class="isOverdue(quest) ? 'text-[#c53e53]' : 'text-[#25385a]'">
              <span class="material-symbols-outlined text-base" aria-hidden="true">event</span>{{ deadlineText || t('common.noDeadline') }}
            </dd>
          </div>
          <div class="flex items-center justify-between gap-4 py-3 text-[12px]">
            <dt class="font-medium text-[#697691]">{{ t('quests.creator') }}</dt>
            <dd class="text-right font-semibold text-[#25385a]">{{ [quest.creator?.firstName, quest.creator?.lastName].filter(Boolean).join(' ') || '—' }}</dd>
          </div>
          <div class="flex items-center justify-between gap-4 pt-3 text-[12px]">
            <dt class="font-medium text-[#697691]">{{ t('timer.title') }}</dt>
            <dd class="font-semibold text-[#5c49bc]">{{ quest.progress?.pomodoroCount || 0 }}</dd>
          </div>
        </dl>
      </section>

      <div class="mt-4"><PomodoroTimer @focus-complete="onPomodoroComplete" /></div>
      <p v-if="notice" class="mt-2 text-center text-xs text-[#247c58]" role="status">{{ notice }}</p>
      <button type="button" class="quest-action mt-4 w-full px-5 py-3.5 text-sm" :disabled="isSaving" @click="toggleComplete">
        <span class="material-symbols-outlined text-xl" aria-hidden="true">{{ isDone ? 'check_circle' : 'task_alt' }}</span>
        {{ isDone ? t('quests.reopen') : t('quests.complete') }}
      </button>
    </template>
  </main>
</template>
