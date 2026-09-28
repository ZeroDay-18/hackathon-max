<script setup>
import TabBar from './components/TabBar.vue'
</script>

<template>
  <main>
    <RouterView />
  </main>
  <TabBar v-if="!$route.meta.hideTabBar" />
</template>

<style scoped></style>
