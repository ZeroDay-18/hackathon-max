<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { formatDeadline, urgency } from '@/utils/date.js'

const props = defineProps({
  task: { type: Object, required: true },
  pending: { type: Boolean, default: false },
  gamified: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle'])

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
    class="group flex gap-3 rounded-[var(--radius-card)] border border-line bg-surface-raised p-3.5 transition-colors"
    :class="task.done ? 'opacity-55' : 'hover:border-line-strong'"
  >
    <!-- чекбокс -->
    <button
      type="button"
      class="tap mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border-2 transition-all duration-300"
      :class="
        task.done
          ? 'border-accent bg-accent'
          : 'border-line-strong hover:border-accent/60 bg-transparent'
      "
      :disabled="pending"
      :aria-pressed="task.done"
      :aria-label="t('tasks.sections.done')"
      @click="emit('toggle', task)"
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
      <span
        v-else
        class="size-1.5 rounded-full bg-transparent transition-colors group-hover:bg-accent/40"
      />
    </button>

    <div class="min-w-0 flex-1">
      <p
        class="text-[15px] leading-snug font-medium transition-colors"
        :class="task.done ? 'text-ink-muted line-through' : 'text-ink'"
      >
        {{ task.title }}
      </p>

      <div class="mt-2 flex flex-wrap items-center gap-1.5">
        <span
          v-if="deadlineText"
          class="flex items-center gap-1 text-xs font-medium"
          :class="deadlineClass"
        >
          <svg
            viewBox="0 0 24 24"
            class="size-3.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="8.5" />
            <path stroke-linecap="round" d="M12 7.5V12l3 2" />
          </svg>
          {{ deadlineText }}
        </span>

        <span
          v-if="task.source === 'max'"
          class="rounded-md border border-line px-1.5 py-0.5 text-[10px] font-semibold text-ink-faint"
        >
          {{ t('tasks.source') }}
        </span>

        <span
          v-for="tag in task.tags"
          :key="tag"
          class="rounded-md bg-accent-dim px-1.5 py-0.5 text-[10px] font-medium text-accent"
        >
          #{{ tag }}
        </span>
      </div>
    </div>
  </article>
</template>
