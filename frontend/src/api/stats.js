import { ENDPOINTS, USE_MOCKS } from './config.js'
import http from './client.js'
import { MOCK_STATS } from './mockData.js'

/**
 * Контракт: { success: boolean, data: {
 *   doneTotal: number, streak: number, onTime: number,
 *   perWeek: number, guildProgress: number, level: number,
 *   xp: number, xpToNext: number
 * }}
 * В обычном режиме (en) поля level/xp/streak фронт не рисует.
 */
export async function fetchStats() {
  if (USE_MOCKS) return { ...MOCK_STATS }

  const payload = await http.get(ENDPOINTS.stats)
  const data = payload?.data ?? payload ?? {}
  return {
    doneTotal: data.doneTotal ?? 0,
    streak: data.streak ?? 0,
    onTime: data.onTime ?? 0,
    perWeek: data.perWeek ?? 0,
    guildProgress: data.guildProgress ?? 0,
    level: data.level ?? 1,
    xp: data.xp ?? 0,
    xpToNext: data.xpToNext ?? 100,
  }
}
