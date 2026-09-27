<template>
  <div class="space-y-2.5">
    <div
      v-for="i in 3"
      :key="i"
      class="flex animate-pulse gap-3 rounded-[var(--radius-card)] border border-line bg-surface-raised p-3.5"
    >
      <div class="size-7 shrink-0 rounded-full bg-line" />
      <div class="flex-1 space-y-2">
        <div class="h-3.5 rounded-full bg-line" :style="{ width: `${90 - i * 12}%` }" />
        <div class="h-2.5 w-24 rounded-full bg-line" />
      </div>
    </div>
  </div>
</template>
