<script setup>
import { useModeStore } from '@/stores/mode.js'

const modeStore = useModeStore()
</script>

<template>
  <div
    class="flex items-center gap-0.5 rounded-full border border-line bg-surface-sunken p-0.5"
    role="tablist"
  >
    <button
      v-for="m in modeStore.modes"
      :key="m.code"
      type="button"
      role="tab"
      :aria-selected="modeStore.locale === m.code"
      class="tap flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap transition-colors duration-200"
      :class="
        modeStore.locale === m.code
          ? 'bg-accent text-surface-sunken'
          : 'text-ink-faint hover:text-ink-muted'
      "
      @click="modeStore.setLocale(m.code)"
    >
      <svg
        v-if="m.icon === 'guild'"
        viewBox="0 0 24 24"
        class="size-3.5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 3.5 20 7v5c0 4-3.4 7-8 8.5C7.4 19 4 16 4 12V7l8-3.5Z"
        />
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        class="size-3.5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="9" cy="8" r="3" />
        <circle cx="16.5" cy="9.5" r="2.4" />
        <path
          stroke-linecap="round"
          d="M3.5 19c.6-3 2.7-4.5 5.5-4.5s4.9 1.5 5.5 4.5M15 14.8c2.4.3 4 1.8 4.5 4.2"
        />
      </svg>
      {{ m.label }}
    </button>
  </div>
</template>
