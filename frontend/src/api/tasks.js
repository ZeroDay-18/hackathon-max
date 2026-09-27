import { ENDPOINTS, USE_MOCKS } from './config.js'
import http from './client.js'
import { MOCK_TASKS } from './mockData.js'

/**
 * Контракт с бэкендом (одна схема на все задачи):
 * {
 *   id: string,
 *   title: string,
 *   subject: string,
 *   description: string,
 *   done: boolean,
 *   status: 'not_started' | 'in_progress' | 'done',
 *   dueAt: string | null,   // ISO-8601
 *   xp: number,
 *   icon: string,
 *   reward: { name: string, rarity: string },
 *   tags: string[],
 *   source: 'max' | 'manual'
 * }
 * Ответ сервера: { success: boolean, data: T[] }
 */

function normalize(raw) {
  return {
    id: String(raw.id ?? raw._id ?? ''),
    title: raw.title ?? raw.text ?? '',
    subject: raw.subject ?? '',
    description: raw.description ?? '',
    done: Boolean(raw.done ?? raw.completed ?? raw.isDone),
    status: raw.status ?? (raw.done ? 'done' : 'not_started'),
    dueAt: raw.dueAt ?? raw.due ?? raw.deadline ?? null,
    xp: raw.xp ?? 0,
    icon: raw.icon ?? 'lab',
    reward: raw.reward ?? null,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    source: raw.source ?? 'manual',
  }
}

function unwrap(payload) {
  const list = Array.isArray(payload) ? payload : (payload?.data ?? payload?.tasks ?? [])
  return Array.isArray(list) ? list.map(normalize) : []
}

let mockStore = null

function getMockStore() {
  if (!mockStore) mockStore = MOCK_TASKS.map((t) => ({ ...t }))
  return mockStore
}

export async function fetchTasks() {
  if (USE_MOCKS) {
    return getMockStore().map((t) => ({ ...t }))
  }
  return unwrap(await http.get(ENDPOINTS.tasks))
}

export async function setTaskDone(id, done) {
  if (USE_MOCKS) {
    const task = getMockStore().find((t) => t.id === id)
    if (task) {
      task.done = done
      task.status = done ? 'done' : 'not_started'
    }
    return { ...task }
  }
  const payload = await http.patch(`${ENDPOINTS.tasks}/${id}`, { done })
  return normalize(payload?.data ?? payload ?? { id, done })
}

export async function completeMany(ids) {
  if (USE_MOCKS) {
    getMockStore().forEach((t) => {
      if (ids.includes(t.id)) {
        t.done = true
        t.status = 'done'
      }
    })
    return []
  }
  const payload = await http.post(`${ENDPOINTS.tasks}/batch`, { ids, done: true })
  return unwrap(payload)
}

/** Бот в MAX скармливает сюда распознанные задачи пачкой */
export async function createTasks(tasks) {
  const payload = await http.post(ENDPOINTS.tasks, { tasks })
  return unwrap(payload)
}
