<script setup>
defineProps({
  title: { type: String, required: true },
  count: { type: Number, default: 0 },
  actionLabel: { type: String, default: '' },
})

const emit = defineEmits(['action'])
</script>

<template>
  <div class="flex items-center justify-between gap-3 px-1">
    <div class="flex min-w-0 items-center gap-2">
      <h2 class="truncate text-sm font-semibold tracking-wide text-ink-muted uppercase">
        {{ title }}
      </h2>
      <span
        class="rounded-full bg-surface-raised px-2 py-0.5 text-[11px] font-bold text-ink-faint tabular-nums"
      >
        {{ count }}
      </span>
    </div>

    <button
      v-if="actionLabel"
      type="button"
      class="tap shrink-0 rounded-full border border-accent/40 px-3 py-1 text-xs font-semibold text-accent"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
