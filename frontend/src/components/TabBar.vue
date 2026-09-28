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

function isActive(tab) {
  if (tab.name === 'quests') return route.path.startsWith('/quests');
  return route.name === tab.name;
}
</script>

<template>
  <nav class="tabbar-safe fixed inset-x-0 bottom-0 z-50" :aria-label="t('nav.home')">
    <div class="mx-auto flex max-w-[440px] items-center justify-around border-t border-[#384665] bg-[#101b30]/98 px-2 pt-2 shadow-[0_-7px_24px_#101b3038] backdrop-blur-lg">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        type="button"
        class="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition"
        :class="isActive(tab) ? 'text-[#ae94ff]' : 'text-[#a3aec5] hover:text-white'"
        :aria-current="isActive(tab) ? 'page' : undefined"
        @click="router.push(tab.path)"
      >
        <span class="material-symbols-outlined text-[22px]" aria-hidden="true">{{ tab.icon }}</span>
        <span class="truncate leading-none">{{ tab.label }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.tabbar-safe { background: #101b30; padding-bottom: max(8px, env(safe-area-inset-bottom)); }
</style>
