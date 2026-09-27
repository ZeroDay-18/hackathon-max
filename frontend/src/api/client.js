import axios from 'axios'

import { API_BASE_URL, API_TIMEOUT } from './config.js'

/**
 * Единственный axios-инстанс во всём приложении.
 * Компоненты и сторы не знают про axios — только про функции из api/*.js
 */
export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskbook:token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      error.userMessage = error.response.data?.message || `HTTP ${error.response.status}`
    } else if (error.code === 'ECONNABORTED') {
      error.userMessage = 'timeout'
    } else {
      error.userMessage = 'network'
    }
    return Promise.reject(error)
  },
)

export default http
