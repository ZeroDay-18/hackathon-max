// stores/counter.js
import { defineStore } from 'pinia'
import { ref } from 'vue' 

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref("");
  const isAuth = ref(false);
  return { accessToken, isAuth }
})