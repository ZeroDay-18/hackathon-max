// ЕДИНЫЙ ФАЙЛ С АДРЕСАМИ БЭКЕНДА.
// Меняешь ссылку здесь или в .env — больше нигде править не нужно.

const DEFAULT_BACKEND_URL = 'http://localhost:3000'

const raw = import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL

// Базовый URL без слэша на конце
export const API_BASE_URL = raw.replace(/\/+$/, '')

// Таймаут запросов, мс
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 10000)

// Включать моки вместо сети (для дизайна, пока бэк не готов)
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

// Эндпоинты
export const ENDPOINTS = {
  auth: '/api/auth/max-miniapp',
  tasks: '/api/tasks',
  stats: '/api/stats',
  profile: '/api/me',
}

export default {
  API_BASE_URL,
  API_TIMEOUT,
  USE_MOCKS,
  ENDPOINTS,
}
