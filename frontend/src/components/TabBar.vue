<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tabs = [
  {
    name: 'homework',
    label: 'ДЗ',
    icon: 'homework',
    path: '/',
  },
  {
    name: 'schedule',
    label: 'Расписание',
    icon: 'schedule',
    path: '/schedule',
  },
  {
    name: 'profile',
    label: 'Профиль',
    icon: 'profile',
    path: '/profile',
  },
]

const activeTab = computed(() => route.name)

function navigate(path) {
  router.push(path)
}
</script>

<template>
  <nav class="tabbar-safe fixed inset-x-0 bottom-0 z-50 px-4">
    <div
      class="
        mx-auto mb-3 flex max-w-md items-center justify-between
        rounded-[26px]
        border border-black/5
        bg-white/80
        px-2 py-2
        shadow-[0_8px_32px_rgba(0,0,0,0.12)]
        backdrop-blur-2xl
        supports-[backdrop-filter]:bg-white/65
        dark:border-white/10
        dark:bg-black/55
      "
    >
      <button
        v-for="tab in tabs"
        :key="tab.name"
        type="button"
        class="
          relative flex min-w-0 flex-1
          flex-col items-center justify-center
          gap-0.5
          rounded-[20px]
          px-2 py-2
          text-[11px]
          font-medium
          transition-all duration-200
          active:scale-95
        "
        :class="
          activeTab === tab.name
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-gray-500 dark:text-gray-400'
        "
        @click="navigate(tab.path)"
      >
        <!-- Active pill -->
        <span
          v-if="activeTab === tab.name"
          class="
            absolute inset-x-3 top-1/2 -z-10
            h-10 -translate-y-1/2
            rounded-2xl
            bg-sky-100
            dark:bg-sky-500/15
          "
        />

        <!-- Иконки -->
        <svg
          v-if="tab.icon === 'homework'"
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 3.75h9.5L19 7.25v13H6a2 2 0 0 1-2-2v-12.5a2 2 0 0 1 2-2Z"
          />
          <path
            stroke-linecap="round"
            d="M15 3.75v3.5h4"
          />
          <path
            stroke-linecap="round"
            d="M8 11h8M8 15h6"
          />
        </svg>

        <svg
          v-else-if="tab.icon === 'schedule'"
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
        >
          <rect
            x="3.5"
            y="5"
            width="17"
            height="15.5"
            rx="2.5"
          />
          <path
            stroke-linecap="round"
            d="M7.5 3.5v3M16.5 3.5v3M3.5 9h17"
          />
          <path
            stroke-linecap="round"
            d="M8 13h2M14 13h2M8 16.5h2M14 16.5h2"
          />
        </svg>

        <svg
          v-else
          class="h-5 w-5"
          viewBox="0 0 24 24"
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

        <span class="leading-none">
          {{ tab.label }}
        </span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.tabbar-safe {
  padding-bottom: max(12px, env(safe-area-inset-bottom));
}
</style>