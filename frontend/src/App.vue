<script setup>
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TabBar from '@/components/TabBar.vue';
import { useAuthStore } from '@/stores/auth.store.js';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

watch(
  () => authStore.isAuth,
  (isAuth) => {
    if (!isAuth && route.name !== 'init') {
      router.replace({ name: 'init' });
    }
  },
);
</script>

<template>
  <main>
    <RouterView />
  </main>
  <TabBar v-if="!$route.meta.hideTabBar" />
</template>
