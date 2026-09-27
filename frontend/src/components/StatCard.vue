<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  unit: { type: String, default: '' },
  accent: { type: Boolean, default: false },
})
</script>

<template>
  <div
    class="rounded-[var(--radius-card)] border p-4"
    :class="accent ? 'border-accent/30 bg-accent-dim' : 'border-line bg-surface-raised'"
  >
    <p class="text-[11px] tracking-wide text-ink-muted uppercase">{{ label }}</p>
    <p class="mt-1.5 flex items-baseline gap-1">
      <span class="text-2xl leading-none font-bold tabular-nums">{{ value }}</span>
      <span v-if="unit" class="text-xs text-ink-faint">{{ unit }}</span>
    </p>
  </div>
</template>
