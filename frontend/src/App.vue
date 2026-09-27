<script setup>
import { onMounted } from 'vue'

import { USE_MOCKS } from './api/config.js'
import TabBar from './components/TabBar.vue'
import { useSessionStore } from './stores/session.js'

const session = useSessionStore()

onMounted(() => {
  // На моках бэк не нужен — не шлём заведомо упадущий запрос
  if (!USE_MOCKS) session.ensureAuth()
})
</script>

<template>
  <main class="relative z-10 min-h-dvh">
    <RouterView />
  </main>
  <TabBar />
</template>
