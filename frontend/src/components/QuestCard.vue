<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import QuestIcon from '@/components/QuestIcon.vue'
import { formatDeadline, urgency } from '@/utils/date.js'

const props = defineProps({
  task: { type: Object, required: true },
})

const emit = defineEmits(['open', 'toggle'])

const { t } = useI18n()

const deadlineText = computed(() => formatDeadline(props.task.dueAt, t))
const level = computed(() => urgency(props.task.dueAt))

const deadlineClass = computed(
  () =>
    ({
      overdue: 'text-danger',
      soon: 'text-warn',
      later: 'text-ink-muted',
      none: 'text-ink-faint',
    })[level.value],
)
</script>

<template>
  <article
    class="group flex cursor-pointer gap-3 rounded-[var(--radius-card)] border border-line bg-surface-raised p-3.5 transition-all hover:border-line-strong hover:shadow-md"
    :class="task.done ? 'opacity-55' : ''"
    @click="emit('open', task.id)"
  >
    <QuestIcon :type="task.icon" />

    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between gap-2">
        <p
          class="text-[15px] leading-snug font-medium transition-colors"
          :class="task.done ? 'text-ink-muted line-through' : 'text-ink'"
        >
          {{ task.title }}
        </p>
        <span
          v-if="task.xp"
          class="shrink-0 rounded-lg bg-accent-dim px-2 py-0.5 text-xs font-bold text-accent"
        >
          +{{ task.xp }} XP
        </span>
      </div>

      <div class="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        <span v-if="task.subject" class="font-medium text-ink-muted">{{ task.subject }}</span>
        <span
          v-if="deadlineText"
          class="flex items-center gap-1 font-medium"
          :class="deadlineClass"
        >
          <svg viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="8.5" />
            <path stroke-linecap="round" d="M12 7.5V12l3 2" />
          </svg>
          {{ deadlineText }}
        </span>
      </div>
    </div>

    <button
      type="button"
      class="tap mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border-2 transition-all duration-300"
      :class="
        task.done
          ? 'border-accent bg-accent'
          : 'border-line-strong group-hover:border-accent/60 bg-transparent'
      "
      :aria-label="t('tasks.sections.done')"
      @click.stop="emit('toggle', task)"
    >
      <svg
        v-if="task.done"
        viewBox="0 0 24 24"
        class="size-4 text-surface-sunken"
        fill="none"
        stroke="currentColor"
        stroke-width="3.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M4.5 12.5 9.5 17.5 19.5 7" />
      </svg>
    </button>
  </article>
</template>
