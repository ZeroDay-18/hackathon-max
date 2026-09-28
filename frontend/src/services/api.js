import { useAuthStore } from '@/stores/auth.store.js';

const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
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
    if (response.status === 401) {
      authStore.clearAuth();
    }

    throw new Error(body.message || 'Request failed');
  }

  return body;
}

export const questApi = {
  list() {
    return request('/api/quests');
  },

  getById(id) {
    return request(`/api/quests/${id}`);
  },

  create(payload) {
    return request('/api/quests', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id, payload) {
    return request(`/api/quests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  remove(id) {
    return request(`/api/quests/${id}`, { method: 'DELETE' });
  },

  updateProgress(id, isCompleted) {
    return request(`/api/quests/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ isCompleted }),
    });
  },

  completePomodoro(id) {
    return request(`/api/quests/${id}/pomodoro`, { method: 'POST' });
  },
};
