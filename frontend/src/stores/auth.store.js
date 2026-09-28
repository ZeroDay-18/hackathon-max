import { defineStore } from 'pinia'
import { ref } from 'vue'

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref('');
  const isAuth = ref(false);
  const user = ref(null);

  function setAuth(token, userData) {
    accessToken.value = token;
    user.value = userData;
    isAuth.value = true;
  }

  function clearAuth() {
    accessToken.value = '';
    user.value = null;
    isAuth.value = false;
  }

  async function authenticateWithMax(initData) {
    try {
      const response = await fetch(`${VITE_BACKEND_URL}/api/auth/max-miniapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      setAuth(data.token, data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Auth error:', error);
      return { success: false, error: error.message };
    }
  }

  return {
    accessToken,
    isAuth,
    user,
    setAuth,
    clearAuth,
    authenticateWithMax
  }
})