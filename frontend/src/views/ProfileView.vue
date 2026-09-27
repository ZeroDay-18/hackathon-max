<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import MascotStage from '@/components/MascotStage.vue'
import StatCard from '@/components/StatCard.vue'
import { useModeStore } from '@/stores/mode.js'
import { useStatsStore } from '@/stores/stats.js'
import { useTasksStore } from '@/stores/tasks.js'

const { t } = useI18n()
const modeStore = useModeStore()
const tasks = useTasksStore()
const stats = useStatsStore()

const gamified = computed(() => modeStore.isGamified)
</script>

<template>
  <div class="tabbar-space safe-top relative z-10 mx-auto w-full max-w-md px-4">
    <header>
      <h1 class="text-lg leading-tight font-bold tracking-tight">{{ t('profile.title') }}</h1>
      <p class="text-xs text-ink-faint">{{ t('app.tagline') }}</p>
    </header>

    <!-- слот под персонажа: сюда встанет картинка -->
    <section
      class="mt-5 flex flex-col items-center rounded-[28px] border border-dashed border-line-strong bg-surface-raised px-4 pt-6 pb-6"
    >
      <MascotStage :stage="tasks.mascotStage" size="160px" />

      <p class="mt-4 text-sm font-semibold">{{ t('profile.character') }}</p>
      <p class="mt-1 text-center text-xs text-ink-faint">{{ t('profile.characterHint') }}</p>

      <!-- слоты кастомизации: заменяем на реальные ассеты -->
      <div class="mt-5 grid w-full grid-cols-4 gap-2">
        <div
          v-for="slot in 4"
          :key="slot"
          class="aspect-square rounded-xl border border-dashed border-line bg-surface-sunken"
        />
      </div>
    </section>

    <!-- статистика -->
    <section class="mt-4">
      <h2 class="mb-2.5 px-1 text-sm font-semibold tracking-wide text-ink-muted uppercase">
        {{ t('profile.stats') }}
      </h2>
      <div class="grid grid-cols-3 gap-3">
        <StatCard
          :label="t('stats.doneTotal')"
          :value="tasks.doneCount"
          :unit="t('stats.doneUnit')"
        />
        <StatCard
          v-if="gamified"
          :label="t('stats.streak')"
          :value="stats.stats?.streak ?? 0"
          :unit="t('stats.streakUnit')"
          accent
        />
        <StatCard :label="t('stats.onTime')" :value="stats.stats?.onTime ?? 0" unit="%" />
      </div>
    </section>
  </div>
</template>
