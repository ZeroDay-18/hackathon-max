<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import QuestIcon from '@/components/QuestIcon.vue'
import TaskSkeleton from '@/components/TaskSkeleton.vue'
import { useTasksStore } from '@/stores/tasks.js'
import { formatDeadline } from '@/utils/date.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const tasks = useTasksStore()

const quest = computed(() => tasks.findTask(route.params.id))
const loading = ref(false)

const statusLabel = computed(() => {
  if (!quest.value) return ''
  return (
    {
      not_started: t('quest.status.not_started'),
      in_progress: t('quest.status.in_progress'),
      done: t('quest.status.done'),
    }[quest.value.status] ?? ''
  )
})

const statusClass = computed(() => {
  if (!quest.value) return ''
  return (
    {
      not_started: 'bg-surface-sunken text-ink-muted',
      in_progress: 'bg-accent-dim text-accent',
      done: 'bg-accent/15 text-accent-strong',
    }[quest.value.status] ?? 'bg-surface-sunken text-ink-muted'
  )
})

async function start() {
  if (!quest.value) return
  loading.value = true
  await tasks.startQuest(quest.value.id)
  loading.value = false
  router.push(`/tasks/${quest.value.id}/complete`)
}

onMounted(() => {
  if (!tasks.tasks.length) tasks.load()
})
</script>

<template>
  <div class="tabbar-space safe-top relative z-10 mx-auto w-full max-w-md px-4">
    <!-- назад -->
    <header class="flex items-center gap-3">
      <button
        type="button"
        class="tap grid size-9 place-items-center rounded-xl border border-line bg-surface-raised text-ink-muted"
        :aria-label="t('common.back')"
        @click="router.back()"
      >
        <svg viewBox="0 0 24 24" class="size-4.5" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5" />
          <path stroke-linecap="round" stroke-linejoin="round" d="m12 19-7-7 7-7" />
        </svg>
      </button>
      <p class="text-sm font-semibold text-ink-muted">{{ t('tasks.title') }}</p>
    </header>

    <TaskSkeleton v-if="tasks.loading && !quest" />

    <template v-else-if="quest">
      <!-- карточка квеста -->
      <section
        class="mt-5 rounded-[28px] border border-line bg-gradient-to-br from-accent/10 via-surface-raised to-surface-raised p-5"
      >
        <div class="flex items-start gap-4">
          <QuestIcon :type="quest.icon" size="56px" />
          <div class="min-w-0 flex-1">
            <h1 class="text-xl leading-tight font-bold">{{ quest.title }}</h1>
            <p v-if="quest.subject" class="mt-1 text-sm text-ink-muted">{{ quest.subject }}</p>
            <span
              v-if="quest.xp"
              class="mt-2 inline-block rounded-lg bg-accent-dim px-2.5 py-1 text-sm font-bold text-accent"
            >
              +{{ quest.xp }} XP
            </span>
          </div>
        </div>
      </section>

      <!-- описание -->
      <section
        v-if="quest.description"
        class="mt-3 rounded-[var(--radius-card)] border border-line bg-surface-raised p-4"
      >
        <p class="text-[11px] tracking-wide text-ink-muted uppercase">{{ t('quest.description') }}</p>
        <p class="mt-2 text-sm leading-relaxed text-ink">{{ quest.description }}</p>
      </section>

      <!-- дедлайн и статус -->
      <section class="mt-3 grid grid-cols-2 gap-3">
        <div class="rounded-[var(--radius-card)] border border-line bg-surface-raised p-4">
          <p class="text-[11px] tracking-wide text-ink-muted uppercase">{{ t('quest.deadline') }}</p>
          <p class="mt-1.5 text-sm font-semibold">
            {{ quest.dueAt ? formatDeadline(quest.dueAt, t) : t('quest.noDeadline') }}
          </p>
        </div>
        <div class="rounded-[var(--radius-card)] border border-line bg-surface-raised p-4">
          <p class="text-[11px] tracking-wide text-ink-muted uppercase">{{ t('quest.status.title') }}</p>
          <span
            class="mt-2 inline-block rounded-lg px-2.5 py-1 text-xs font-bold"
            :class="statusClass"
          >
            {{ statusLabel }}
          </span>
        </div>
      </section>

      <!-- кнопка действия -->
      <div class="mt-6">
        <button
          v-if="quest.status === 'not_started'"
          type="button"
          class="tap w-full rounded-2xl bg-gradient-to-r from-accent-strong to-accent py-4 text-base font-bold text-white shadow-lg transition-opacity disabled:opacity-50"
          :disabled="loading"
          @click="start"
        >
          {{ t('quest.start') }}
        </button>
        <button
          v-else-if="quest.status === 'in_progress'"
          type="button"
          class="tap w-full rounded-2xl bg-gradient-to-r from-accent-strong to-accent py-4 text-base font-bold text-white shadow-lg"
          @click="start"
        >
          {{ t('quest.continue') }}
        </button>
        <div
          v-else
          class="w-full rounded-2xl border border-accent/30 bg-accent-dim py-4 text-center text-base font-bold text-accent"
        >
          {{ t('quest.completed') }}
        </div>
      </div>
    </template>

    <div
      v-else
      class="mt-10 text-center text-sm text-ink-faint"
    >
      {{ t('quest.notFound') }}
    </div>
  </div>
</template>
