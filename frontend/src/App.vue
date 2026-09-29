<script setup>
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TabBar from '@/components/TabBar.vue';
import { useAuthStore } from '@/stores/auth.store.js';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const tabIndex = computed(() => ({ dashboard: 0, quests: 1, guild: 2, profile: 3 }[route.name] ?? 1));
const hasVideoBackground = computed(() => ['dashboard', 'quests', 'guild', 'profile'].includes(route.name));
const backgroundStyle = computed(() => ({
  '--background-parallax-x': `${[-3, -1, 1, 3][tabIndex.value]}%`,
  '--background-parallax-y': `${[2, 3, 4, 5][tabIndex.value]}%`,
}));

watch(
  () => authStore.isAuth,
  (isAuth) => {
    if (!isAuth && route.name !== 'init') router.replace({ name: 'init' });
  },
);
</script>

<template>
  <div class="app-shell" :style="backgroundStyle">
    <div v-if="hasVideoBackground" class="app-video-background" aria-hidden="true">
      <video class="app-video-background__media" autoplay muted loop playsinline preload="metadata">
        <source src="/bg-video.mp4" type="video/mp4">
      </video>
      <div class="app-video-background__scrim" />
    </div>
    <div class="app-shell__content"><RouterView /></div>
    <TabBar v-if="!$route.meta.hideTabBar" />
  </div>
</template>
