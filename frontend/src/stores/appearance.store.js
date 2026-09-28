import { defineStore } from 'pinia';
import { ref } from 'vue';
import i18n from '@/i18n';

export const useAppearanceStore = defineStore('appearance', () => {
  const locale = ref('ru-serious');

  function applyLocale(nextLocale) {
    locale.value = nextLocale;
    i18n.global.locale.value = nextLocale;
    document.documentElement.lang = 'ru';
  }

  applyLocale(locale.value);

  return { locale, applyLocale };
});
