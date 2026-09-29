import { ref } from 'vue';
import { defineStore } from 'pinia';
import { profileApi } from '@/services/api.js';
import { useAuthStore } from '@/stores/auth.store.js';
import { useAppearanceStore } from '@/stores/appearance.store.js';

export const usePlayerStore = defineStore('player', () => {
  const progression = ref(null);
  const isLoaded = ref(false);
  const isLoading = ref(false);
  const error = ref('');

  function applyProfile(profile) {
    const authStore = useAuthStore();
    const appearanceStore = useAppearanceStore();

    authStore.updateUser(profile.user);
    progression.value = profile.progression;
    appearanceStore.applyLocale(profile.user.preferences.interfaceMode);
    isLoaded.value = true;
  }

  async function loadProfile() {
    isLoading.value = true;
    error.value = '';

    try {
      const profile = await profileApi.get();
      applyProfile(profile);
      return profile;
    } catch (requestError) {
      error.value = requestError.message;
      throw requestError;
    } finally {
      isLoading.value = false;
    }
  }

  function applyProgression(nextProgression) {
    if (nextProgression) progression.value = nextProgression;
  }

  return { progression, isLoaded, isLoading, error, applyProfile, loadProfile, applyProgression };
});
