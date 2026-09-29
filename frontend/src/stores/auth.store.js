import { defineStore } from 'pinia';
import { ref } from 'vue';

const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref('');
  const isAuth = ref(false);
  const user = ref(null);

  function setAuth(token, userData) {
    accessToken.value = token;
    user.value = userData;
    isAuth.value = true;
  }

  function updateUser(userData) {
    user.value = userData;
  }

  function clearAuth() {
    accessToken.value = '';
    user.value = null;
    isAuth.value = false;
  }

  async function authenticateWithMax(initData) {
    try {
      const response = await fetch(`${backendUrl}/api/auth/max-miniapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || 'Authentication failed');
        error.code = data.code;
        error.status = response.status;
        throw error;
      }

      setAuth(data.token, data.user);
      return { success: true, user: data.user, progression: data.progression };
    } catch (error) {
      console.error('Auth error:', error);
      return { success: false, error: error.message, code: error.code, status: error.status };
    }
  }

  return { accessToken, isAuth, user, setAuth, updateUser, clearAuth, authenticateWithMax };
});
