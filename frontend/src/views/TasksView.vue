<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import EmptyState from '@/components/EmptyState.vue'
import ModeSwitch from '@/components/ModeSwitch.vue'
import QuestCard from '@/components/QuestCard.vue'
import TaskSkeleton from '@/components/TaskSkeleton.vue'
import { useTasksStore } from '@/stores/tasks.js'

const { t } = useI18n()
const tasks = useTasksStore()

const tab = ref('active')

const tabs = computed(() => [
  { key: 'active', label: t('tasks.tabs.active', { count: tasks.activeTasks.length }) },
  { key: 'done', label: t('tasks.tabs.done', { count: tasks.doneTasks.length }) },
])

const visibleTasks = computed(() => {
  const list = tab.value === 'done' ? tasks.doneTasks : tasks.activeTasks
  return [...list].sort((a, b) => {
    if (a.done !== b.done) return Number(a.done) - Number(b.done)
    if (!a.dueAt) return 1
    if (!b.dueAt) return -1
    return new Date(a.dueAt) - new Date(b.dueAt)
  })
})

const progressText = computed(() =>
  t('tasks.progress', { done: tasks.doneCount, total: tasks.total }),
)

onMounted(() => {
  if (!tasks.tasks.length) tasks.load()
})
</script>

<template>
  <div class="tabbar-space safe-top relative z-10 mx-auto w-full max-w-md px-4">
    <header class="flex items-center justify-between gap-3">
      <div>
        <h1 class="text-lg leading-tight font-bold tracking-tight">{{ t('tasks.title') }}</h1>
        <p class="text-xs text-ink-faint">{{ progressText }}</p>
      </div>
      <ModeSwitch />
    </header>

    <!-- прогресс -->
    <div class="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
      <div
        class="h-full rounded-full bg-gradient-to-r from-accent-strong to-accent transition-[width] duration-500"
        :style="{ width: `${tasks.percent}%` }"
      />
    </div>

    <!-- вкладки -->
    <div class="mt-4 grid grid-cols-2 gap-1 rounded-2xl border border-line bg-surface-sunken p-1">
      <button
        v-for="tb in tabs"
        :key="tb.key"
        type="button"
        class="tap rounded-xl py-2 text-sm font-semibold transition-all"
        :class="
          tab === tb.key
            ? 'bg-surface-raised text-accent shadow-sm'
            : 'text-ink-muted hover:text-ink'
        "
        @click="tab = tb.key"
      >
        {{ tb.label }}
      </button>
    </div>

    <!-- список -->
    <div class="mt-4 space-y-2.5">
      <TaskSkeleton v-if="tasks.loading" />

      <EmptyState
        v-else-if="!visibleTasks.length"
        :title="t('tasks.empty')"
        :hint="t('tasks.emptyHint')"
      />

      <ul v-else class="space-y-2.5">
        <li v-for="task in visibleTasks" :key="task.id">
          <QuestCard
            :task="task"
            @toggle="tasks.toggle"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
