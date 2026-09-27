<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import EmptyState from '@/components/EmptyState.vue'
import MascotStage from '@/components/MascotStage.vue'
import ModeSwitch from '@/components/ModeSwitch.vue'
import ProgressRing from '@/components/ProgressRing.vue'
import StatCard from '@/components/StatCard.vue'
import TaskCard from '@/components/TaskCard.vue'
import TaskSkeleton from '@/components/TaskSkeleton.vue'
import { useModeStore } from '@/stores/mode.js'
import { useStatsStore } from '@/stores/stats.js'
import { useTasksStore } from '@/stores/tasks.js'
import { formatDeadline } from '@/utils/date.js'

const { t } = useI18n()
const modeStore = useModeStore()
const tasks = useTasksStore()
const stats = useStatsStore()

const gamified = computed(() => modeStore.isGamified)

const nextDeadlineText = computed(
  () => formatDeadline(tasks.nextDeadline?.dueAt, t) ?? t('home.noDeadlines'),
)

const statsCards = computed(() => {
  const s = stats.stats
  const cards = [
    { label: t('stats.doneTotal'), value: tasks.doneCount, unit: t('stats.doneUnit') },
    { label: t('stats.onTime'), value: s?.onTime ?? 0, unit: '%' },
  ]

  if (gamified.value) {
    cards.unshift({
      label: t('stats.streak'),
      value: s?.streak ?? 0,
      unit: t('stats.streakUnit'),
      accent: true,
    })
  } else {
    cards.push({ label: t('stats.perWeek'), value: s?.perWeek ?? 0, unit: t('stats.perWeek') })
  }

  return cards
})

const guildProgress = computed(() => stats.stats?.guildProgress ?? tasks.percent)

onMounted(async () => {
  await Promise.all([tasks.load(), stats.load()])
})
</script>

<template>
  <div class="tabbar-space safe-top relative z-10 mx-auto w-full max-w-md px-4">
    <!-- шапка -->
    <header class="flex items-center justify-between gap-3">
      <div>
        <h1 class="text-lg leading-tight font-bold tracking-tight">
          {{ t('app.title') }}
        </h1>
        <p class="text-xs text-ink-faint">{{ t('app.tagline') }}</p>
      </div>
      <ModeSwitch />
    </header>

    <!-- маскот (только в гейм-режиме) -->
    <section
      v-if="gamified"
      class="mt-5 flex flex-col items-center rounded-[28px] border border-line bg-surface-raised px-4 pt-7 pb-6"
    >
      <MascotStage :stage="tasks.mascotStage" size="188px" />

      <p class="mt-5 text-sm font-semibold">
        {{ t('mascot.stage') }} {{ tasks.mascotStage }}/4 · {{ t('mascot.level') }}
        {{ stats.level }}
      </p>
      <p class="mt-1 text-xs text-ink-faint">{{ t('home.mascotHint') }}</p>

      <!-- XP -->
      <div class="mt-4 w-full">
        <div class="h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
          <div
            class="h-full rounded-full bg-accent transition-[width] duration-700 ease-out"
            :style="{ width: `${stats.xpPercent}%` }"
          />
        </div>
        <p class="mt-2 text-center text-[11px] text-ink-muted">
          <template v-if="stats.stats">
            {{ t('mascot.xpToNext', { xp: stats.stats.xpToNext - stats.stats.xp }) }}
          </template>
          <template v-else>{{ t('mascot.maxLevel') }}</template>
        </p>
      </div>
    </section>

    <!-- сводка (обычный режим) -->
    <section
      v-else
      class="mt-5 flex flex-col items-center rounded-[28px] border border-line bg-surface-raised px-4 pt-7 pb-6"
    >
      <ProgressRing :value="tasks.percent" :size="150" :label="t('home.todayProgress')" />
      <p class="mt-5 text-xs text-ink-faint">{{ t('home.mascotHint') }}</p>
    </section>

    <!-- прогресс дня -->
    <section class="mt-3 grid grid-cols-2 gap-3">
      <div class="rounded-[var(--radius-card)] border border-line bg-surface-raised p-4">
        <p class="text-[11px] tracking-wide text-ink-muted uppercase">
          {{ t('home.todayProgress') }}
        </p>
        <p class="mt-1.5 text-2xl leading-none font-bold tabular-nums">
          {{ tasks.todayStats.done
          }}<span class="text-base text-ink-faint">/{{ tasks.todayStats.total }}</span>
        </p>
        <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
          <div
            class="h-full rounded-full bg-accent transition-[width] duration-500"
            :style="{ width: `${tasks.todayStats.percent}%` }"
          />
        </div>
      </div>

      <div class="rounded-[var(--radius-card)] border border-line bg-surface-raised p-4">
        <p class="text-[11px] tracking-wide text-ink-muted uppercase">
          {{ t('home.nextDeadline') }}
        </p>
        <p class="mt-1.5 text-sm leading-snug font-semibold">
          {{ tasks.nextDeadline ? tasks.nextDeadline.title : t('home.noDeadlines') }}
        </p>
        <p v-if="tasks.nextDeadline" class="mt-1 text-[11px] text-warn">
          {{ nextDeadlineText }}
        </p>
      </div>
    </section>

    <!-- статистика -->
    <section class="mt-3 grid grid-cols-3 gap-3">
      <StatCard
        v-for="card in statsCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :unit="card.unit"
        :accent="card.accent"
      />
    </section>

    <!-- прогресс гильдии/группы -->
    <section class="mt-3 rounded-[var(--radius-card)] border border-line bg-surface-raised p-4">
      <div class="flex items-center justify-between">
        <p class="text-sm font-semibold">{{ t('guild.title') }}</p>
        <p class="text-xs text-ink-faint">{{ guildProgress }}%</p>
      </div>
      <p class="mt-0.5 text-xs text-ink-muted">{{ t('guild.progress') }}</p>
      <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
        <div
          class="h-full rounded-full bg-gradient-to-r from-accent-strong to-accent transition-[width] duration-700"
          :style="{ width: `${guildProgress}%` }"
        />
      </div>
    </section>

    <!-- последние задачи -->
    <section class="mt-5">
      <h2 class="mb-2.5 px-1 text-sm font-semibold tracking-wide text-ink-muted uppercase">
        {{ t('tasks.title') }}
      </h2>

      <TaskSkeleton v-if="tasks.loading" />

      <EmptyState
        v-else-if="!tasks.activeTasks.length"
        :title="t('tasks.empty')"
        :hint="t('tasks.emptyHint')"
      />

      <ul v-else class="space-y-2.5">
        <li v-for="task in tasks.activeTasks.slice(0, 3)" :key="task.id">
          <TaskCard :task="task" :gamified="gamified" @toggle="tasks.toggle" />
        </li>
      </ul>
    </section>
  </div>
</template>
