import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { completeMany, fetchTasks, setTaskDone } from '@/api/tasks.js'

const DAY = 24 * 60 * 60 * 1000

function startOfDay(ts) {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export const SECTION_ORDER = ['overdue', 'today', 'tomorrow', 'later', 'done']

function bucketOf(task, now) {
  if (task.done) return 'done'
  if (!task.dueAt) return 'later'

  const due = new Date(task.dueAt).getTime()
  const today = startOfDay(now)

  if (due < today) return 'overdue'
  if (due < today + DAY) return 'today'
  if (due < today + 2 * DAY) return 'tomorrow'
  return 'later'
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pendingIds = ref(new Set())

  const activeTasks = computed(() => tasks.value.filter((t) => !t.done))
  const doneTasks = computed(() => tasks.value.filter((t) => t.done))

  const total = computed(() => tasks.value.length)
  const doneCount = computed(() => doneTasks.value.length)
  const percent = computed(() =>
    total.value === 0 ? 0 : Math.round((doneCount.value / total.value) * 100),
  )

  /** Задачи, разложенные по секциям: просрочено / сегодня / завтра / позже / готово */
  const sections = computed(() => {
    const now = Date.now()
    const buckets = {
      overdue: [],
      today: [],
      tomorrow: [],
      later: [],
      done: [],
    }

    for (const task of tasks.value) {
      buckets[bucketOf(task, now)].push(task)
    }

    for (const list of Object.values(buckets)) {
      list.sort((a, b) => {
        if (a.done !== b.done) return Number(a.done) - Number(b.done)
        if (!a.dueAt) return 1
        if (!b.dueAt) return -1
        return new Date(a.dueAt) - new Date(b.dueAt)
      })
    }

    return SECTION_ORDER.map((key) => ({ key, items: buckets[key] })).filter(
      (s) => s.items.length > 0,
    )
  })

  const todayStats = computed(() => {
    const now = Date.now()
    const today = startOfDay(now)
    const items = tasks.value.filter((t) => {
      if (!t.dueAt) return false
      const due = new Date(t.dueAt).getTime()
      return due >= today && due < today + DAY
    })
    const done = items.filter((t) => t.done).length
    return {
      total: items.length,
      done,
      percent: items.length ? Math.round((done / items.length) * 100) : 0,
    }
  })

  const nextDeadline = computed(() => {
    const now = Date.now()
    const items = activeTasks.value
      .filter((t) => t.dueAt && new Date(t.dueAt).getTime() >= now)
      .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))
    return items[0] ?? null
  })

  /** 5 стадий маскота: 0-19% → 0, …, 80-100% → 4 */
  const mascotStage = computed(() => Math.min(4, Math.floor(percent.value / 20)))

  async function load() {
    loading.value = true
    error.value = null
    try {
      tasks.value = await fetchTasks()
    } catch (e) {
      error.value = e.userMessage ?? 'error'
    } finally {
      loading.value = false
    }
  }

  async function toggle(task) {
    const next = !task.done
    pendingIds.value = new Set(pendingIds.value).add(task.id)
    const snapshot = tasks.value.map((t) => ({ ...t }))
    tasks.value = tasks.value.map((t) => (t.id === task.id ? { ...t, done: next } : t))

    try {
      await setTaskDone(task.id, next)
    } catch (e) {
      tasks.value = snapshot
      error.value = e.userMessage ?? 'error'
    } finally {
      const nextSet = new Set(pendingIds.value)
      nextSet.delete(task.id)
      pendingIds.value = nextSet
    }
  }

  async function completeSection(items) {
    const ids = items.map((t) => t.id)
    const snapshot = tasks.value.map((t) => ({ ...t }))
    tasks.value = tasks.value.map((t) => (ids.includes(t.id) ? { ...t, done: true } : t))

    try {
      await completeMany(ids)
    } catch (e) {
      tasks.value = snapshot
      error.value = e.userMessage ?? 'error'
    }
  }

  return {
    tasks,
    loading,
    error,
    pendingIds,
    activeTasks,
    doneTasks,
    total,
    doneCount,
    percent,
    sections,
    todayStats,
    nextDeadline,
    mascotStage,
    load,
    toggle,
    completeSection,
  }
})
