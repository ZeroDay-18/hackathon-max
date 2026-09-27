<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import QuestIcon from '@/components/QuestIcon.vue'
import TaskSkeleton from '@/components/TaskSkeleton.vue'
import { useTasksStore } from '@/stores/tasks.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const tasks = useTasksStore()

const quest = computed(() => tasks.findTask(route.params.id))
const loading = ref(false)

const reward = computed(() => quest.value?.reward ?? null)

async function finish() {
  if (!quest.value) return
  loading.value = true
  await tasks.completeQuest(quest.value.id)
  loading.value = false
  router.push('/tasks')
}

onMounted(() => {
  if (!tasks.tasks.length) tasks.load()
})
</script>

<template>
  <div class="safe-top relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-4">
    <TaskSkeleton v-if="tasks.loading && !quest" />

    <template v-else-if="quest">
      <!-- иллюстрация -->
      <div
        class="mt-8 flex flex-1 flex-col items-center justify-center rounded-[32px] bg-gradient-to-b from-accent/20 via-accent/5 to-transparent px-6 py-10 text-center"
      >
        <div class="animate-bounce">
          <QuestIcon :type="quest.icon" size="96px" />
        </div>

        <h1 class="mt-6 text-2xl font-bold">{{ t('quest.complete.title') }}</h1>
        <p class="mt-1 text-sm text-ink-muted">{{ quest.title }}</p>

        <!-- XP -->
        <div
          v-if="quest.xp"
          class="mt-5 flex items-center gap-2 rounded-2xl bg-white/80 px-5 py-3 shadow-lg"
        >
          <svg viewBox="0 0 24 24" class="size-6 text-warn" fill="currentColor">
            <path
              d="M12 2l2.9 6.26 6.6.56-5 4.36 1.5 6.45L12 16.9 5.99 19.63l1.5-6.45-5-4.36 6.6-.56L12 2z"
            />
          </svg>
          <span class="text-xl font-bold text-ink">+{{ quest.xp }} XP</span>
        </div>

        <!-- награда -->
        <div
          v-if="reward"
          class="mt-4 w-full max-w-xs rounded-2xl border border-line bg-white/90 p-4 shadow-lg"
        >
          <p class="text-[11px] tracking-wide text-ink-muted uppercase">{{ t('quest.reward') }}</p>
          <div class="mt-2 flex items-center gap-3">
            <div class="grid size-12 place-items-center rounded-xl bg-accent-dim text-2xl">
              🎁
            </div>
            <div class="text-left">
              <p class="text-sm font-bold">{{ reward.name }}</p>
              <p class="text-xs text-accent">{{ reward.rarity }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- кнопка -->
      <div class="pb-10">
        <button
          type="button"
          class="tap w-full rounded-2xl bg-gradient-to-r from-accent-strong to-accent py-4 text-base font-bold text-white shadow-lg transition-opacity disabled:opacity-50"
          :disabled="loading"
          @click="finish"
        >
          {{ t('quest.continue') }}
        </button>
      </div>
    </template>

    <div
      v-else
      class="flex flex-1 items-center justify-center text-sm text-ink-faint"
    >
      {{ t('quest.notFound') }}
    </div>
  </div>
</template>
