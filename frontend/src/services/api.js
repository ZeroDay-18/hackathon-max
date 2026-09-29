import { useAuthStore } from '@/stores/auth.store.js';

const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

export async function request(path, options = {}) {
  const authStore = useAuthStore();
  const headers = new Headers(options.headers);

  headers.set('Content-Type', 'application/json');
  if (authStore.accessToken) {
    headers.set('Authorization', `Bearer ${authStore.accessToken}`);
  }

  const response = await fetch(`${backendUrl}${path}`, {
    ...options,
    headers,
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) authStore.clearAuth();

    const error = new Error(body.message || 'Request failed');
    error.code = body.code;
    error.status = response.status;
    throw error;
  }

  return body;
}

export const questApi = {
  list: () => request('/api/quests'),
  getById: (id) => request(`/api/quests/${id}`),
  create: (payload) => request('/api/quests', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/quests/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/quests/${id}`, { method: 'DELETE' }),
  updateProgress: (id, isCompleted) => request(`/api/quests/${id}/progress`, { method: 'PATCH', body: JSON.stringify({ isCompleted }) }),
  completePomodoro: (id) => request(`/api/quests/${id}/pomodoro`, { method: 'POST' }),
};

export const profileApi = {
  get: () => request('/api/profile'),
  updatePreferences: (payload) => request('/api/profile/preferences', { method: 'PATCH', body: JSON.stringify(payload) }),
};

export const pollApi = {
  vote: (questId, optionId) => request(`/api/polls/${questId}/vote`, { method: 'POST', body: JSON.stringify({ optionId }) }),
};

export const notificationApi = {
  list: () => request('/api/notifications'),
  markRead: (id) => request(`/api/notifications/${id}/read`, { method: 'PATCH' }),
};

export const emotionDiaryApi = {
  list: () => request('/api/emotion-diary'),
  summary: (period, timezone) => request(`/api/emotion-diary/summary?period=${period}&timezone=${encodeURIComponent(timezone)}`),
  create: (payload) => request('/api/emotion-diary', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/emotion-diary/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/emotion-diary/${id}`, { method: 'DELETE' }),
};
