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

const slots = [
  { icon: '👕', label: t('profile.slotCharacter') },
  { icon: '🖼️', label: t('profile.slotBackground') },
  { icon: '🎩', label: t('profile.slotHat') },
  { icon: '💎', label: t('profile.slotCurrency') },
]
</script>

<template>
  <div class="tabbar-space safe-top relative z-10 mx-auto w-full max-w-md px-4">
    <!-- задник с маскотом -->
    <section
      class="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-accent/25 via-accent/5 to-transparent px-4 pt-8 pb-6"
    >
      <div class="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-accent/10 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-10 -left-10 size-40 rounded-full bg-accent/10 blur-3xl" />

      <div class="relative flex flex-col items-center">
        <MascotStage :stage="tasks.mascotStage" size="180px" />
        <p class="mt-4 text-lg font-bold">{{ t('profile.character') }}</p>
        <p class="text-xs text-ink-muted">{{ t('mascot.level') }} {{ stats.level }}</p>
      </div>

      <!-- слоты кастомизации -->
      <div class="relative mt-6 grid grid-cols-4 gap-2">
        <div
          v-for="slot in slots"
          :key="slot.label"
          class="flex flex-col items-center gap-1.5 rounded-2xl border border-line bg-white/80 p-3 text-center backdrop-blur"
        >
          <span class="text-2xl">{{ slot.icon }}</span>
          <span class="text-[10px] font-medium text-ink-muted">{{ slot.label }}</span>
        </div>
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
