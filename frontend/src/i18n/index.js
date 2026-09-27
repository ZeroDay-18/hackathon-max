import { computed, ref } from 'vue'
import { createI18n } from 'vue-i18n'

import ru from './locales/ru.js'
import en from './locales/en.js'

// Две локали = два варианта продукта:
// ru -> геймифицированный (гильдии, квесты, маскот, уровни)
// en -> обычный (группы, задачи, сроки), без прогрессии
export const LOCALES = [
  { code: 'ru', label: 'Гильдии', icon: 'guild' },
  { code: 'en', label: 'Группы', icon: 'group' },
]

export const MODE_BY_LOCALE = {
  ru: 'gamified',
  en: 'plain',
}

const STORAGE_KEY = 'taskbook:locale'

function readStoredLocale() {
  if (typeof window === 'undefined') return null
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return saved && LOCALES.some((l) => l.code === saved) ? saved : null
}

const initialLocale = readStoredLocale() ?? 'ru'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initialLocale,
  fallbackLocale: 'ru',
  messages: { ru, en },
})

const activeLocale = ref(initialLocale)

function applyLocale(locale) {
  activeLocale.value = locale
  i18n.global.locale.value = locale
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', locale)
  }
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, locale)
  }
}

applyLocale(initialLocale)

export const mode = computed(() => MODE_BY_LOCALE[activeLocale.value] ?? 'plain')
export const isGamified = computed(() => mode.value === 'gamified')
export const locale = computed(() => activeLocale.value)

export function setLocale(next) {
  if (!MODE_BY_LOCALE[next]) return
  applyLocale(next)
}

export default i18n
