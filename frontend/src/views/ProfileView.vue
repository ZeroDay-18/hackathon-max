<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AvatarFrame from '@/components/AvatarFrame.vue';
import { useAuthStore } from '@/stores/auth.store.js';
import { useAppearanceStore } from '@/stores/appearance.store.js';

const { t } = useI18n();
const authStore = useAuthStore();
const appearanceStore = useAppearanceStore();
const fullName = computed(() => [authStore.user?.firstName, authStore.user?.lastName].filter(Boolean).join(' '));
</script>

<template>
  <main class="quest-page">
    <header class="bg-[#111d33] px-4 pb-8 pt-[max(22px,env(safe-area-inset-top))]">
      <p class="text-xs font-semibold text-[#bdafff]">StudyQuest</p>
      <h1 class="mt-1 text-[20px] font-extrabold text-white">{{ t('profile.title') }}</h1>
    </header>
    <div class="relative -mt-5 space-y-4 px-4">
      <section class="paper-card flex items-center gap-4 p-4">
        <AvatarFrame :name="fullName" :photo-url="authStore.user?.photoUrl" class="h-[68px] w-[68px] text-2xl" />
        <div class="min-w-0">
          <h2 class="truncate text-[16px] font-extrabold text-[#1b2847]">{{ fullName }}</h2>
          <p class="mt-1 text-[12px] text-[#68748e]">{{ t('profile.group') }}: {{ authStore.user?.group?.name || '—' }}</p>
        </div>
      </section>

      <section class="paper-card p-4">
        <div class="flex items-center gap-2 text-[#1b2847]">
          <span class="material-symbols-outlined text-[21px] text-[#684cd0]" aria-hidden="true">tune</span>
          <h2 class="text-[14px] font-extrabold">{{ t('profile.languageMode') }}</h2>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-2">
          <button
            v-for="mode in ['ru-serious', 'ru-game']"
            :key="mode"
            type="button"
            class="rounded-xl border px-3 py-3 text-sm font-bold transition"
            :class="appearanceStore.locale === mode ? 'border-[#8269e3] bg-[#eeeaff] text-[#513bb3]' : 'border-[#dce1ed] bg-[#f8f9fd] text-[#63718d]'"
            :aria-pressed="appearanceStore.locale === mode"
            @click="appearanceStore.applyLocale(mode)"
          >
            {{ t(`profile.${mode === 'ru-serious' ? 'serious' : 'gamified'}`) }}
          </button>
        </div>
      </section>
    </div>
  </main>
</template>
