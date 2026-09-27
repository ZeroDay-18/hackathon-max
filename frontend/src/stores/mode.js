import { computed } from 'vue'
import { defineStore } from 'pinia'

import { isGamified, locale, LOCALES, setLocale } from '@/i18n'

export const useModeStore = defineStore('mode', () => {
  const modes = LOCALES

  function toggle() {
    setLocale(locale.value === 'ru' ? 'en' : 'ru')
  }

  return {
    modes,
    locale,
    mode: computed(() => (locale.value === 'ru' ? 'gamified' : 'plain')),
    isGamified,
    setLocale,
    toggle,
  }
})
