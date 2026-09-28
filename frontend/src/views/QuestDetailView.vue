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
  <main class="mx-auto min-h-dvh max-w-md bg-[#070913] px-4 pb-8 pt-[max(1rem,env(safe-area-inset-top))] text-slate-100">
    <header class="flex items-center justify-between gap-3">
      <button
        type="button"
        class="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 text-slate-300 hover:bg-white/10"
        :aria-label="t('common.back')"
        @click="router.back()"
      >
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 class="text-base font-semibold text-white">{{ t('quests.detail') }}</h1>
      <button
        v-if="isCreator"
        type="button"
        class="grid h-10 w-10 place-items-center rounded-2xl bg-rose-400/10 text-rose-200 hover:bg-rose-400/20"
        :aria-label="t('quests.delete')"
        @click="removeQuest"
      >
        <span class="material-symbols-outlined">delete</span>
      </button>
      <span v-else class="h-10 w-10" />
    </header>

    <p v-if="error" class="mt-8 rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-200">
      {{ error }}
      <button type="button" class="ml-2 underline" @click="load">{{ t('common.retry') }}</button>
    </p>
    <p v-else-if="!quest" class="py-16 text-center text-sm text-slate-400">{{ t('common.loading') }}</p>

    <template v-else>
      <section class="mt-7 rounded-3xl border border-white/10 bg-slate-900/70 p-5 text-center shadow-xl shadow-black/20">
        <span class="material-symbols-outlined inline-grid h-16 w-16 place-items-center rounded-3xl text-3xl ring-1" :class="typeStyle.color">
          {{ typeStyle.icon }}
        </span>
        <p class="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-violet-300">{{ t(`quests.types.${quest.type}`) }}</p>
        <h2 class="mt-2 text-2xl font-bold text-white">{{ quest.title }}</h2>
        <p v-if="quest.group" class="mt-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">{{ quest.group.name }}</p>
        <p v-else class="mt-3 text-xs text-slate-400">{{ t('quests.personal') }}</p>
      </section>

      <section class="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5">
        <h3 class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{{ t('quests.description') }}</h3>
        <p class="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-200">{{ quest.description || '—' }}</p>
        <dl class="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm">
          <div class="flex items-center justify-between gap-4">
            <dt class="text-slate-400">{{ t('quests.deadline') }}</dt>
            <dd :class="isOverdue(quest) ? 'font-medium text-rose-300' : 'text-slate-200'">{{ deadlineText || t('common.noDeadline') }}</dd>
          </div>
          <div class="flex items-center justify-between gap-4">
            <dt class="text-slate-400">{{ t('quests.creator') }}</dt>
            <dd class="text-right text-slate-200">{{ [quest.creator?.firstName, quest.creator?.lastName].filter(Boolean).join(' ') || '—' }}</dd>
          </div>
          <div class="flex items-center justify-between gap-4">
            <dt class="text-slate-400">{{ t('quests.pomodoroSessions', { count: quest.progress?.pomodoroCount || 0 }) }}</dt>
          </div>
        </dl>
      </section>

      <section class="mt-4">
        <PomodoroTimer @focus-complete="onPomodoroComplete" />
        <p v-if="notice" class="mt-2 text-center text-xs text-emerald-300">{{ notice }}</p>
      </section>

      <button
        type="button"
        class="mt-5 w-full rounded-2xl px-5 py-3.5 text-sm font-semibold transition disabled:opacity-60"
        :class="isDone ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300' : 'bg-violet-500 text-white hover:bg-violet-400'"
        :disabled="isSaving"
        @click="toggleComplete"
      >
        <span class="material-symbols-outlined mr-1 align-middle text-lg">{{ isDone ? 'check_circle' : 'check' }}</span>
        {{ isDone ? t('quests.reopen') : t('quests.complete') }}
      </button>
    </template>
  </main>
</template>
