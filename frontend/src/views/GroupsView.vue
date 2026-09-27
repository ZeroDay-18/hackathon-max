<script setup>
import { useI18n } from 'vue-i18n'

import ModeSwitch from '@/components/ModeSwitch.vue'

const { t } = useI18n()
</script>

<template>
  <div class="tabbar-space safe-top relative z-10 mx-auto w-full max-w-md px-4">
    <header class="flex items-center justify-between gap-3">
      <div>
        <h1 class="text-lg leading-tight font-bold tracking-tight">{{ t('groups.title') }}</h1>
        <p class="text-xs text-ink-faint">{{ t('groups.comingSoon') }}</p>
      </div>
      <ModeSwitch />
    </header>

    <div
      class="mt-16 flex flex-col items-center justify-center rounded-[28px] border border-dashed border-line-strong bg-surface-raised/50 px-6 py-16 text-center"
    >
      <div class="grid size-16 place-items-center rounded-2xl bg-accent-dim text-3xl text-accent">
        👥
      </div>
      <p class="mt-4 text-base font-semibold">{{ t('groups.title') }}</p>
      <p class="mt-1 text-sm text-ink-faint">{{ t('groups.comingSoon') }}</p>
    </div>
  </div>
</template>
