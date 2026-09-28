<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const tabs = computed(() => [
  { name: 'dashboard', label: t('nav.home'), icon: 'home', path: { name: 'dashboard' } },
  { name: 'quests', label: t('nav.quests'), icon: 'assignment', path: { name: 'quests' } },
  { name: 'profile', label: t('nav.profile'), icon: 'person', path: { name: 'profile' } },
]);

function isActive(tab) {
  if (tab.name === 'quests') return route.path.startsWith('/quests');
  return route.name === tab.name;
}
</script>

<template>
  <nav class="tabbar-safe fixed inset-x-0 bottom-0 z-50 px-4">
    <div class="mx-auto mb-3 flex max-w-md items-center justify-between rounded-[26px] border border-white/10 bg-[#0f1423]/95 p-2 shadow-2xl shadow-black/35 backdrop-blur-xl">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        type="button"
        class="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[20px] px-2 py-2 text-[11px] font-medium transition active:scale-95"
        :class="isActive(tab) ? 'text-violet-300' : 'text-slate-400'"
        @click="router.push(tab.path)"
      >
        <span
          v-if="isActive(tab)"
          class="absolute inset-x-3 top-1/2 -z-10 h-10 -translate-y-1/2 rounded-2xl bg-violet-500/20"
        />
        <span class="material-symbols-outlined text-[22px]" aria-hidden="true">{{ tab.icon }}</span>
        <span class="leading-none">{{ tab.label }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.tabbar-safe {
  padding-bottom: max(12px, env(safe-area-inset-bottom));
}
</style>
