<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const tabs = computed(() => [
  { name: 'dashboard', label: t('nav.home'), icon: 'home', path: { name: 'dashboard' } },
  { name: 'quests', label: t('nav.quests'), icon: 'auto_stories', path: { name: 'quests' } },
  { name: 'guild', label: t('nav.groups'), icon: 'groups', path: { name: 'guild' } },
  { name: 'profile', label: t('nav.profile'), icon: 'person', path: { name: 'profile' } },
]);
function isActive(tab) { return tab.name === 'quests' ? route.path.startsWith('/quests') || route.path.startsWith('/polls') : route.name === tab.name; }
</script>

<template>
  <nav class="tabbar-safe fixed inset-x-0 bottom-0 z-50" aria-label="Основная навигация">
    <div class="mx-auto flex max-w-[440px] items-center justify-around border-t border-[#374563] bg-[#0e182c]/[.98] px-2 pt-2 shadow-[0_-8px_26px_#0207118a] backdrop-blur-xl">
      <button v-for="tab in tabs" :key="tab.name" type="button" class="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition" :class="isActive(tab) ? 'text-[#c0adff]' : 'text-[#91a0c0]'" :aria-current="isActive(tab) ? 'page' : undefined" @click="router.push(tab.path)">
        <span class="material-symbols-outlined nav-icon text-[23px]" :class="{ 'nav-icon--active': isActive(tab) }" aria-hidden="true">{{ tab.icon }}</span>
        <span class="truncate leading-none">{{ tab.label }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.tabbar-safe { background: #0e182c; padding-bottom: max(9px, env(safe-area-inset-bottom)); }
.nav-icon { font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24; }
.nav-icon--active { font-variation-settings: 'FILL' 1, 'wght' 650, 'GRAD' 0, 'opsz' 24; filter: drop-shadow(0 0 6px rgb(174 144 255 / .55)); }
</style>
