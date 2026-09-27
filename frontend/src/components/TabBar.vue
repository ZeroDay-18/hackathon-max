<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const tabs = [
  { name: 'home', icon: 'home', path: '/' },
  { name: 'tasks', icon: 'tasks', path: '/tasks' },
  { name: 'groups', icon: 'groups', path: '/groups' },
  { name: 'profile', icon: 'profile', path: '/profile' },
]

const activeTab = computed(() => {
  if (route.path.startsWith('/tasks')) return 'tasks'
  if (route.path.startsWith('/profile')) return 'profile'
  if (route.path.startsWith('/groups')) return 'groups'
  return 'home'
})

function navigate(path) {
  if (route.path !== path) router.push(path)
}
</script>

<template>
  <nav class="tabbar-safe fixed inset-x-0 bottom-0 z-50 px-4">
    <div
      class="mx-auto mb-3 flex max-w-md items-center justify-between rounded-[26px] border border-line bg-surface-raised/90 px-1.5 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-2xl"
    >
      <button
        v-for="tab in tabs"
        :key="tab.name"
        type="button"
        class="tap relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[20px] px-1 py-1.5 text-[10px] font-medium transition-colors duration-200"
        :class="activeTab === tab.name ? 'text-accent' : 'text-ink-faint'"
        @click="navigate(tab.path)"
      >
        <span
          v-if="activeTab === tab.name"
          class="absolute inset-x-2 top-1/2 -z-10 h-9 -translate-y-1/2 rounded-xl bg-accent-dim"
        />

        <svg
          v-if="tab.icon === 'home'"
          viewBox="0 0 24 24"
          class="size-5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 11.2 12 4.5l8 6.7V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7.8Z"
          />
          <path stroke-linecap="round" d="M9.5 20v-5.5h5V20" />
        </svg>

        <svg
          v-else-if="tab.icon === 'tasks'"
          viewBox="0 0 24 24"
          class="size-5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 11.5l2 2 4-4M12 3l1.8 3.9 4.2.4-3.2 2.9.9 4.1L12 12.3l-3.7 2 .9-4.1-3.2-2.9 4.2-.4L12 3z"
          />
        </svg>

        <svg
          v-else-if="tab.icon === 'groups'"
          viewBox="0 0 24 24"
          class="size-5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
          />
          <circle cx="9" cy="7" r="4" />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M23 21v-2a4 4 0 0 0-3-3.87"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16 3.13a4 4 0 0 1 0 7.75"
          />
        </svg>

        <svg
          v-else
          viewBox="0 0 24 24"
          class="size-5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
        >
          <circle cx="12" cy="8" r="3.25" />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5.5 20c.7-3.25 2.9-5 6.5-5s5.8 1.75 6.5 5"
          />
        </svg>

        <span class="leading-none">{{ t(`nav.${tab.name}`) }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.tabbar-safe {
  padding-bottom: max(12px, env(safe-area-inset-bottom));
}
</style>
