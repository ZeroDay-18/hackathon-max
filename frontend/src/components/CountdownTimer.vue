<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  target: { type: String, required: true },
})

const { t } = useI18n()

const now = ref(Date.now())
let timer = null

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})

const parts = computed(() => {
  const diff = new Date(props.target).getTime() - now.value
  if (diff <= 0) return null

  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
  const seconds = Math.floor((diff % (60 * 1000)) / 1000)

  return { days, hours, minutes, seconds }
})

const text = computed(() => {
  if (!parts.value) return t('home.deadlinePassed')
  const { days, hours, minutes, seconds } = parts.value
  const pad = (n) => String(n).padStart(2, '0')
  if (days > 0) return `${days} ${t('time.days')} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
})
</script>

<template>
  <span class="font-semibold tabular-nums text-warn">{{ text }}</span>
</template>
