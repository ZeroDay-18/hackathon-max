import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { fetchStats } from '@/api/stats.js'
import { useTasksStore } from './tasks.js'

export const useStatsStore = defineStore('stats', () => {
  const stats = ref(null)
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      stats.value = await fetchStats()
    } catch {
      stats.value = null
    } finally {
      loading.value = false
    }
  }

  /** Уровень и опыт считаем локально из задач, пока бэк не отдаёт свой счёт */
  const localLevel = computed(() => {
    const tasks = useTasksStore()
    return Math.floor(tasks.percent / 20) + 1
  })

  const level = computed(() => stats.value?.level ?? localLevel.value)
  const xpPercent = computed(() => {
    if (!stats.value) return useTasksStore().percent
    return Math.min(100, Math.round((stats.value.xp / stats.value.xpToNext) * 100))
  })

  const user = computed(() => stats.value?.user ?? null)

  return { stats, loading, load, level, xpPercent, user }
})
