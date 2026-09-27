<script setup>
defineProps({
  icon: { type: String, default: 'sparkles' },
  title: { type: String, required: true },
  hint: { type: String, default: '' },
})
</script>

<template>
  <div class="grid place-items-center gap-3 px-6 py-14 text-center">
    <div
      class="grid size-14 place-items-center rounded-full border border-line bg-surface-raised text-ink-faint"
    >
      <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="1.7">
        <path
          v-if="icon === 'sparkles'"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.2 10.2 12.6 4.5 10.8 10.2 9 12 3.5ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"
        />
        <path
          v-else
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5.5 6.5h13M5.5 12h13M5.5 17.5h8"
        />
      </svg>
    </div>
    <div>
      <p class="text-[15px] font-semibold text-ink">{{ title }}</p>
      <p v-if="hint" class="mt-1 text-sm text-ink-muted">{{ hint }}</p>
    </div>
  </div>
</template>
