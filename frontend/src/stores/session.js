import { ref } from 'vue'
import { defineStore } from 'pinia'

import { authenticate, clearToken, readToken, readMaxInitData } from '@/api/auth.js'

export const useSessionStore = defineStore('session', () => {
  const user = ref(null)
  const initData = ref(readMaxInitData())
  const checking = ref(false)
  const error = ref(null)

  const isAuthed = ref(Boolean(readToken()))

  /**
   * Регистрирует пользователя по initData из MAX.
   * Ошибка не блокирует интерфейс: на моках дизайн должен быть виден всегда.
   */
  async function ensureAuth() {
    if (isAuthed.value || checking.value) return
    if (!initData.value) return

    checking.value = true
    error.value = null

    try {
      const result = await authenticate(initData.value)
      user.value = result.user
      isAuthed.value = Boolean(result.token)
    } catch (e) {
      error.value = e.userMessage ?? 'error'
    } finally {
      checking.value = false
    }
  }

  function logout() {
    clearToken()
    user.value = null
    isAuthed.value = false
  }

  return { user, initData, checking, error, isAuthed, ensureAuth, logout }
})
