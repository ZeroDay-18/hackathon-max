<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDeadline, isOverdue, questTypeStyles } from '@/utils/quest.js';

const props = defineProps({
  quest: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();
const emit = defineEmits(['open', 'toggle-complete']);

const typeStyle = computed(() => questTypeStyles[props.quest.type] || questTypeStyles.homework);
const isDone = computed(() => Boolean(props.quest.progress?.completedAt));
const deadlineText = computed(() => formatDeadline(props.quest.deadline));
</script>

<template>
  <article
    class="group rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/10 backdrop-blur transition hover:border-violet-400/35"
    :class="{ 'opacity-65': isDone }"
  >
    <div class="flex gap-3">
      <span
        class="material-symbols-outlined grid h-11 w-11 shrink-0 place-items-center rounded-2xl ring-1"
        :class="typeStyle.color"
        aria-hidden="true"
      >
        {{ typeStyle.icon }}
      </span>

      <button type="button" class="min-w-0 flex-1 text-left" @click="emit('open', quest.id)">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-white">{{ quest.title }}</p>
            <p class="mt-1 text-xs text-slate-400">{{ t(`quests.types.${quest.type}`) }}</p>
          </div>
          <span
            v-if="quest.group"
            class="shrink-0 rounded-full bg-white/5 px-2 py-1 text-[10px] font-medium text-slate-300"
          >
            {{ quest.group.name }}
          </span>
        </div>

        <div class="mt-3 flex items-center gap-1.5 text-xs">
          <span class="material-symbols-outlined text-sm" :class="isOverdue(quest) ? 'text-rose-300' : 'text-slate-500'">schedule</span>
          <span :class="isOverdue(quest) ? 'font-medium text-rose-300' : 'text-slate-400'">
            {{ deadlineText || t('common.noDeadline') }}
          </span>
        </div>
      </button>

      <button
        type="button"
        class="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border transition"
        :class="isDone ? 'border-emerald-400 bg-emerald-500 text-slate-950' : 'border-slate-600 text-transparent hover:border-violet-400'"
        :aria-label="isDone ? t('quests.reopen') : t('quests.complete')"
        @click="emit('toggle-complete', quest)"
      >
        <span class="material-symbols-outlined text-base">check</span>
      </button>
    </div>
  </article>
</template>
