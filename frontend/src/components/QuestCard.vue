<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDeadline, isOverdue, questTypeStyles } from '@/utils/quest.js';

const props = defineProps({ quest: { type: Object, required: true } });
const { t } = useI18n();
const emit = defineEmits(['open', 'toggle-complete']);
const typeStyle = computed(() => questTypeStyles[props.quest.type] || questTypeStyles.homework);
const isDone = computed(() => Boolean(props.quest.progress?.completedAt));
const deadlineText = computed(() => formatDeadline(props.quest.deadline));
</script>

<template>
  <article class="paper-card flex items-center gap-3 p-3 transition hover:border-[#8973e7]">
    <span class="material-symbols-outlined grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[23px] ring-1" :class="typeStyle.color" aria-hidden="true">{{ typeStyle.icon }}</span>
    <button type="button" class="min-w-0 flex-1 text-left" @click="emit('open', quest.id)">
      <span class="block truncate text-[13px] font-bold text-white">{{ quest.title }}</span>
      <span class="mt-0.5 block truncate text-[11px] text-[#aab8d4]">{{ quest.subject || t(`quests.types.${quest.type}`) }}<template v-if="quest.group"> · {{ quest.group.name }}</template></span>
      <span class="mt-2 flex items-center gap-1 text-[11px] font-bold" :class="isDone ? 'text-[#75daa5]' : isOverdue(quest) ? 'text-[#ff9da8]' : 'text-[#c0abff]'">
        <span class="material-symbols-outlined text-sm" aria-hidden="true">{{ isDone ? 'task_alt' : 'schedule' }}</span>{{ isDone ? t('quests.completed') : isOverdue(quest) ? `${t('common.overdue')} · ${deadlineText}` : deadlineText || t('common.noDeadline') }}
      </span>
    </button>
    <button type="button" class="grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition" :class="isDone ? 'border-[#5ecf91] bg-[#264c41] text-[#9af3bf]' : 'border-[#7563c2] bg-[#2e2858] text-[#d0c5ff]'" :aria-label="isDone ? t('quests.reopen') : t('quests.complete')" @click="emit('toggle-complete', quest)">
      <span class="material-symbols-outlined text-[20px]" aria-hidden="true">{{ isDone ? 'check_circle' : 'radio_button_unchecked' }}</span>
    </button>
  </article>
</template>
