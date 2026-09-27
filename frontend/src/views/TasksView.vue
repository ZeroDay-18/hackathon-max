<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import EmptyState from '@/components/EmptyState.vue'
import ModeSwitch from '@/components/ModeSwitch.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import TaskCard from '@/components/TaskCard.vue'
import TaskSkeleton from '@/components/TaskSkeleton.vue'
import { useModeStore } from '@/stores/mode.js'
import { useTasksStore } from '@/stores/tasks.js'

const { t } = useI18n()
const modeStore = useModeStore()
const tasks = useTasksStore()

const gamified = computed(() => modeStore.isGamified)
const filter = ref('all')

const filters = computed(() => [
  { key: 'all', label: t('tasks.filters.all') },
  { key: 'active', label: t('tasks.filters.active') },
  { key: 'done', label: t('tasks.filters.done') },
])

const visibleSections = computed(() => {
  if (filter.value === 'active') {
    return tasks.sections.filter((s) => s.key !== 'done')
  }
  if (filter.value === 'done') {
    return tasks.sections.filter((s) => s.key === 'done')
  }
  return tasks.sections
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
        class="h-full rounded-full bg-accent transition-[width] duration-500"
        :style="{ width: `${tasks.percent}%` }"
      />
    </div>

    <!-- фильтры -->
    <div class="scroll-x mt-4 -mx-4 flex gap-2 px-4">
      <button
        v-for="f in filters"
        :key="f.key"
        type="button"
        class="tap shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors"
        :class="
          filter === f.key
            ? 'border-accent/50 bg-accent-dim text-accent'
            : 'border-line bg-surface-raised text-ink-muted'
        "
        @click="filter = f.key"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- состояния -->
    <div class="mt-4 space-y-6">
      <TaskSkeleton v-if="tasks.loading" />

      <EmptyState
        v-else-if="!visibleSections.length"
        :title="t('tasks.empty')"
        :hint="t('tasks.emptyHint')"
      />

      <section v-for="section in visibleSections" :key="section.key" class="space-y-2.5">
        <SectionHeader
          :title="t(`tasks.sections.${section.key}`)"
          :count="section.items.length"
          :action-label="section.key !== 'done' ? t('tasks.markSectionDone') : ''"
          @action="tasks.completeSection(section.items)"
        />

        <ul class="space-y-2.5">
          <li v-for="task in section.items" :key="task.id">
            <TaskCard
              :task="task"
              :pending="tasks.pendingIds.has(task.id)"
              :gamified="gamified"
              @toggle="tasks.toggle"
            />
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
