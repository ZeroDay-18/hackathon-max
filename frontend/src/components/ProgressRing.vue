<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, default: 0 },
  size: { type: Number, default: 128 },
  stroke: { type: Number, default: 10 },
  label: { type: String, default: '' },
})

const radius = computed(() => (props.size - props.stroke) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dash = computed(() => (Math.min(100, Math.max(0, props.value)) / 100) * circumference.value)
const center = computed(() => props.size / 2)
</script>

<template>
  <div
    class="relative grid place-items-center"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg :width="size" :height="size" class="-rotate-90">
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        stroke="var(--color-line)"
        :stroke-width="stroke"
      />
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        stroke="var(--color-accent)"
        :stroke-width="stroke"
        stroke-linecap="round"
        :stroke-dasharray="`${dash} ${circumference}`"
        class="transition-[stroke-dasharray] duration-700 ease-out"
      />
    </svg>
    <div class="absolute inset-0 grid place-items-center text-center">
      <div>
        <p class="text-3xl leading-none font-bold tabular-nums">{{ value }}%</p>
        <p v-if="label" class="mt-1 text-xs text-ink-muted">{{ label }}</p>
      </div>
    </div>
  </div>
</template>
