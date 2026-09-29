<script setup>
import { computed } from 'vue';

const props = defineProps({
  progression: { type: Object, default: null },
});

const stats = computed(() => [
  { label: 'INT', value: props.progression?.stats?.intelligence ?? 0, icon: 'menu_book', color: 'text-sky-300' },
  { label: 'END', value: props.progression?.stats?.endurance ?? 0, icon: 'bolt', color: 'text-emerald-300' },
  { label: 'REP', value: props.progression?.stats?.reputation ?? 0, icon: 'groups', color: 'text-amber-300' },
]);
</script>

<template>
  <div class="grid grid-cols-3 gap-3">
    <div v-for="stat in stats" :key="stat.label" class="relative overflow-hidden rounded-[18px] border border-white/10 bg-[#101a31]/83 px-2 py-3 text-center shadow-lg backdrop-blur-md">
      <span class="material-symbols-outlined text-[22px]" :class="stat.color" aria-hidden="true">{{ stat.icon }}</span>
      <p class="mt-1 text-[10px] font-bold tracking-wide text-[#a9b6d2]">{{ stat.label }}</p>
      <p class="mt-0.5 text-xl font-black text-white">{{ stat.value }}</p>
    </div>
  </div>
</template>
