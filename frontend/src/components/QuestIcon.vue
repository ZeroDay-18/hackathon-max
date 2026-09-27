<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'lab' },
  size: { type: String, default: '44px' },
})

const ICONS = {
  lab: { emoji: '🔬', bg: '#6c5ce7' },
  essay: { emoji: '✍️', bg: '#00b894' },
  meeting: { emoji: '👥', bg: '#fdcb6e' },
  exam: { emoji: '🎓', bg: '#0984e3' },
  test: { emoji: '📝', bg: '#e17055' },
  presentation: { emoji: '📊', bg: '#e84393' },
  practice: { emoji: '⚗️', bg: '#00cec9' },
  seminar: { emoji: '💬', bg: '#a29bfe' },
}

const icon = computed(() => ICONS[props.type] ?? ICONS.lab)
</script>

<template>
  <div
    class="grid shrink-0 place-items-center rounded-2xl"
    :style="{ width: size, height: size, backgroundColor: icon.bg + '1a' }"
  >
    <span class="text-xl leading-none">{{ icon.emoji }}</span>
  </div>
</template>
