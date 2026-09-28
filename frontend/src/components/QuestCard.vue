<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDeadline, isOverdue, questTypeStyles } from '@/utils/quest.js';

const props = defineProps({
  quest: { type: Object, required: true },
});

const { t } = useI18n();
const emit = defineEmits(['open', 'toggle-complete']);
const typeStyle = computed(() => questTypeStyles[props.quest.type] || questTypeStyles.homework);
const isDone = computed(() => Boolean(props.quest.progress?.completedAt));
const deadlineText = computed(() => formatDeadline(props.quest.deadline));
</script>

<template>
  <article class="paper-card flex items-center gap-3 p-3 transition hover:border-[#a99af2] hover:shadow-lg">
    <span
      class="material-symbols-outlined grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-[25px] ring-1"
      :class="typeStyle.color"
      aria-hidden="true"
    >{{ typeStyle.icon }}</span>

    <button type="button" class="min-w-0 flex-1 py-1 text-left" @click="emit('open', quest.id)">
      <span class="block truncate text-[13px] font-bold leading-5 text-[#182647]">{{ quest.title }}</span>
      <span class="mt-0.5 block truncate text-[11px] text-[#64718e]">
        {{ t(`quests.types.${quest.type}`) }}<template v-if="quest.group"> · {{ quest.group.name }}</template>
      </span>
      <span
        class="mt-2 flex items-center gap-1 text-[11px] font-semibold"
        :class="isDone ? 'text-[#27835c]' : isOverdue(quest) ? 'text-[#d34a58]' : 'text-[#8560d6]'"
      >
        <span class="material-symbols-outlined text-sm" aria-hidden="true">{{ isDone ? 'task_alt' : 'schedule' }}</span>
        {{ isDone ? t('quests.completed') : isOverdue(quest) ? `${t('common.overdue')} · ${deadlineText}` : deadlineText || t('common.noDeadline') }}
      </span>
    </button>

    <button
      type="button"
      class="grid h-9 w-9 shrink-0 place-items-center rounded-xl transition"
      :class="isDone ? 'bg-[#e5f6eb] text-[#258554]' : 'bg-[#f3f0ff] text-[#7256d0] hover:bg-[#e5dfff]'"
      :aria-label="isDone ? t('quests.reopen') : t('quests.complete')"
      @click="emit('toggle-complete', quest)"
    >
      <span class="material-symbols-outlined text-[20px]" aria-hidden="true">{{ isDone ? 'check_circle' : 'radio_button_unchecked' }}</span>
    </button>
  </article>
</template>
