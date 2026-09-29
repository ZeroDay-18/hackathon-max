import { defineStore } from 'pinia';
import { ref } from 'vue';
import i18n from '@/i18n';

export const useAppearanceStore = defineStore('appearance', () => {
  const locale = ref('ru-serious');

  function applyLocale(nextLocale) {
    const normalizedLocale = nextLocale === 'ru-game' ? 'ru-game' : 'ru-serious';
    locale.value = normalizedLocale;
    i18n.global.locale.value = normalizedLocale;
    document.documentElement.lang = 'ru';
    document.documentElement.dataset.interfaceMode = normalizedLocale === 'ru-game' ? 'game' : 'serious';
  }

  applyLocale(locale.value);

  return { locale, applyLocale };
});
