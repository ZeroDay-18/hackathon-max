<script setup>
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth.store.js';
import { useAppearanceStore } from '@/stores/appearance.store.js';

const { t } = useI18n();
const authStore = useAuthStore();
const appearanceStore = useAppearanceStore();
</script>

<template>
  <main class="mx-auto min-h-dvh max-w-md bg-[#070913] px-4 pb-28 pt-[max(1rem,env(safe-area-inset-top))] text-slate-100">
    <header>
      <p class="text-sm text-violet-300">StudyQuest</p>
      <h1 class="mt-1 text-2xl font-bold text-white">{{ t('profile.title') }}</h1>
    </header>

    <section class="mt-7 rounded-3xl border border-white/10 bg-slate-900/70 p-5">
      <div class="flex items-center gap-4">
        <div class="grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/20 text-xl font-bold text-violet-200">
          {{ authStore.user?.firstName?.slice(0, 1) || '?' }}
        </div>
        <div>
          <h2 class="font-semibold text-white">{{ [authStore.user?.firstName, authStore.user?.lastName].filter(Boolean).join(' ') }}</h2>
          <p class="mt-1 text-sm text-slate-400">{{ t('profile.group') }}: {{ authStore.user?.group?.name || '—' }}</p>
        </div>
      </div>
    </section>

    <section class="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5">
      <h2 class="text-sm font-semibold text-white">{{ t('profile.languageMode') }}</h2>
      <div class="mt-4 grid grid-cols-2 gap-2">
        <button
          v-for="mode in ['ru-serious', 'ru-game']"
          :key="mode"
          type="button"
          class="rounded-2xl border px-3 py-3 text-sm font-medium transition"
          :class="appearanceStore.locale === mode ? 'border-violet-400 bg-violet-500/20 text-white' : 'border-white/10 bg-white/5 text-slate-400'"
          @click="appearanceStore.applyLocale(mode)"
        >
          {{ t(`profile.${mode === 'ru-serious' ? 'serious' : 'gamified'}`) }}
        </button>
      </div>
    </section>
  </main>
</template>
