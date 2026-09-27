import { ENDPOINTS } from './config.js'
import http from './client.js'

/** initData прилетает из окна MAX миниаппки */
export function readMaxInitData() {
  if (typeof window === 'undefined') return ''
  return window.WebApp?.initData ?? ''
}

/** Регистрирует пользователя по initData, бэк отдаёт { user, token } */
export async function authenticate(initData = readMaxInitData()) {
  const payload = await http.post(ENDPOINTS.auth, { initData })
  const token = payload?.data?.token ?? payload?.token ?? null

  if (token) {
    localStorage.setItem('taskbook:token', token)
  }

  return {
    user: payload?.data?.user ?? payload?.user ?? null,
    token,
  }
}

export function readToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('taskbook:token')
}

export function clearToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('taskbook:token')
}
