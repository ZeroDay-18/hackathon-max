<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import CountdownTimer from '@/components/CountdownTimer.vue'
import MascotStage from '@/components/MascotStage.vue'
import ModeSwitch from '@/components/ModeSwitch.vue'
import ProgressRing from '@/components/ProgressRing.vue'
import StatCard from '@/components/StatCard.vue'
import TaskCard from '@/components/TaskCard.vue'
import TaskSkeleton from '@/components/TaskSkeleton.vue'
import { useModeStore } from '@/stores/mode.js'
import { useStatsStore } from '@/stores/stats.js'
import { useTasksStore } from '@/stores/tasks.js'

const { t } = useI18n()
const router = useRouter()
const modeStore = useModeStore()
const tasks = useTasksStore()
const stats = useStatsStore()

const gamified = computed(() => modeStore.isGamified)

const user = computed(() => stats.user)
const userName = computed(() => user.value?.name ?? t('home.greeting'))
const userLevel = computed(() => stats.level)
const userXp = computed(() => stats.stats?.xp ?? 0)
const userXpToNext = computed(() => stats.stats?.xpToNext ?? 100)
const characteristics = computed(() => user.value?.characteristics ?? [])
const group = computed(() => user.value?.group ?? null)

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

onMounted(async () => {
  await Promise.all([tasks.load(), stats.load()])
})
</script>

<template>
  <div class="tabbar-space safe-top relative z-10 mx-auto w-full max-w-md px-4">
    <!-- шапка -->
    <header class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <div
          class="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-strong text-lg font-bold text-white shadow-lg"
        >
          S
        </div>
        <div>
          <h1 class="text-lg leading-tight font-bold tracking-tight">
            {{ t('app.title') }}
          </h1>
          <p class="text-xs text-ink-faint">{{ t('app.tagline') }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="tap grid size-9 place-items-center rounded-xl border border-line bg-surface-raised text-ink-muted"
          :aria-label="t('common.settings')"
        >
          <svg viewBox="0 0 24 24" class="size-4.5" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="12" r="3" />
            <path
              stroke-linecap="round"
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
            />
          </svg>
        </button>
        <ModeSwitch />
      </div>
    </header>

    <!-- карточка профиля -->
    <section
      class="mt-5 rounded-[28px] border border-line bg-gradient-to-br from-accent/10 via-surface-raised to-surface-raised p-4"
    >
      <div class="flex items-center gap-3.5">
        <div
          class="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-strong text-2xl font-bold text-white shadow-md"
        >
          {{ userName.charAt(0) }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-base font-bold">{{ userName }}</p>
          <p class="text-xs text-ink-muted">
            {{ t('mascot.level') }} {{ userLevel }}
          </p>
          <div class="mt-2">
            <div class="flex items-center justify-between text-[11px] text-ink-muted">
              <span>XP</span>
              <span class="tabular-nums font-semibold">{{ userXp }} / {{ userXpToNext }}</span>
            </div>
            <div class="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
              <div
                class="h-full rounded-full bg-gradient-to-r from-accent-strong to-accent transition-[width] duration-700"
                :style="{ width: `${stats.xpPercent}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- характеристики -->
      <div v-if="gamified && characteristics.length" class="mt-4 grid grid-cols-3 gap-2.5">
        <div
          v-for="c in characteristics"
          :key="c.key"
          class="rounded-2xl border border-line bg-white/70 p-3 text-center"
        >
          <div class="mx-auto mb-1.5 grid size-8 place-items-center rounded-xl bg-accent-dim text-accent">
            <svg v-if="c.icon === 'book'" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
            </svg>
            <svg v-else-if="c.icon === 'lightning'" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
            </svg>
            <svg v-else viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <p class="text-[10px] font-semibold tracking-wider text-ink-faint uppercase">{{ c.label }}</p>
          <p class="text-lg leading-tight font-bold tabular-nums">{{ c.value }}</p>
        </div>
      </div>
    </section>

    <!-- маскот (только в гейм-режиме) -->
    <section
      v-if="gamified"
      class="mt-3 flex flex-col items-center rounded-[28px] border border-line bg-surface-raised px-4 pt-6 pb-5"
    >
      <MascotStage :stage="tasks.mascotStage" size="150px" />
      <p class="mt-4 text-xs text-ink-faint">{{ t('home.mascotHint') }}</p>
    </section>

    <!-- прогресс дня (обычный режим) -->
    <section
      v-else
      class="mt-3 flex flex-col items-center rounded-[28px] border border-line bg-surface-raised px-4 pt-6 pb-5"
    >
      <ProgressRing :value="tasks.percent" :size="150" :label="t('home.todayProgress')" />
      <p class="mt-4 text-xs text-ink-faint">{{ t('home.mascotHint') }}</p>
    </section>

    <!-- группа -->
    <section
      v-if="group"
      class="mt-3 rounded-[var(--radius-card)] border border-line bg-surface-raised p-4"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="grid size-10 place-items-center rounded-xl bg-accent-dim text-accent">
            <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-bold">{{ group.name }}</p>
            <p class="text-xs text-ink-muted">{{ t('guild.members') }}: {{ group.members }}</p>
          </div>
        </div>
        <p class="text-sm font-bold text-accent tabular-nums">{{ group.progress }}%</p>
      </div>
      <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
        <div
          class="h-full rounded-full bg-gradient-to-r from-accent-strong to-accent transition-[width] duration-700"
          :style="{ width: `${group.progress}%` }"
        />
      </div>
    </section>

    <!-- ближайший дедлайн -->
    <section class="mt-3 rounded-[var(--radius-card)] border border-line bg-surface-raised p-4">
      <p class="text-[11px] tracking-wide text-ink-muted uppercase">{{ t('home.nextDeadline') }}</p>
      <template v-if="tasks.nextDeadline">
        <div class="mt-2 flex items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold">{{ tasks.nextDeadline.title }}</p>
            <p class="text-xs text-ink-faint">{{ tasks.nextDeadline.subject }}</p>
          </div>
          <CountdownTimer :target="tasks.nextDeadline.dueAt" />
        </div>
      </template>
      <p v-else class="mt-1 text-sm text-ink-faint">{{ t('home.noDeadlines') }}</p>
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

    <!-- последние задачи -->
    <section class="mt-5">
      <div class="mb-2.5 flex items-center justify-between px-1">
        <h2 class="text-sm font-semibold tracking-wide text-ink-muted uppercase">
          {{ t('tasks.title') }}
        </h2>
        <button
          type="button"
          class="tap text-xs font-semibold text-accent"
          @click="router.push('/tasks')"
        >
          {{ t('home.goToTasks') }}
        </button>
      </div>

      <TaskSkeleton v-if="tasks.loading" />

      <ul v-else-if="tasks.activeTasks.length" class="space-y-2.5">
        <li v-for="task in tasks.activeTasks.slice(0, 3)" :key="task.id">
          <TaskCard :task="task" :gamified="gamified" @toggle="tasks.toggle" />
        </li>
      </ul>
    </section>
  </div>
</template>
