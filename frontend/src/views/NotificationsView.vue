<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { notificationApi } from '@/services/api.js';

const router = useRouter();
const notifications = ref([]);
const isLoading = ref(true);
const error = ref('');
const typeIcon = { quest_created: 'auto_stories', quest_completed: 'emoji_events', deadline: 'schedule' };
const typeColor = { quest_created: 'bg-[#47358f] text-[#c8b6ff]', quest_completed: 'bg-[#205d4b] text-[#a7f0bf]', deadline: 'bg-[#725023] text-[#ffdda0]' };

async function load() {
  isLoading.value = true;
  error.value = '';
  try { notifications.value = (await notificationApi.list()).notifications; } catch (requestError) { error.value = requestError.message; } finally { isLoading.value = false; }
}

async function openNotification(notification) {
  if (!notification.readAt) {
    const response = await notificationApi.markRead(notification.id).catch(() => null);
    if (response) notification.readAt = response.notification.readAt;
  }
  if (notification.questId) router.push({ name: 'quest-detail', params: { id: notification.questId } });
}

function formatDate(value) { return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }
onMounted(load);
</script>

<template>
  <main class="quest-page quest-page--plain">
    <header class="flex items-center justify-between"><button type="button" class="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white" aria-label="Назад" @click="router.back()"><span class="material-symbols-outlined" aria-hidden="true">arrow_back</span></button><h1 class="text-lg font-extrabold text-white">Уведомления</h1><span class="h-9 w-9" /></header>
    <p v-if="isLoading" class="paper-card mt-6 p-8 text-center text-sm text-[#b4c0d9]">Загрузка…</p>
    <div v-else-if="error" class="paper-card mt-6 p-4 text-sm text-[#ffb7c4]">{{ error }} <button type="button" class="ml-2 underline" @click="load">Повторить</button></div>
    <div v-else-if="notifications.length" class="mt-6 space-y-2.5">
      <button v-for="notification in notifications" :key="notification.id" type="button" class="paper-card flex w-full items-start gap-3 p-3 text-left" :class="{ 'opacity-60': notification.readAt }" @click="openNotification(notification)">
        <span class="material-symbols-outlined grid h-10 w-10 shrink-0 place-items-center rounded-xl" :class="typeColor[notification.type] || typeColor.quest_created" aria-hidden="true">{{ typeIcon[notification.type] || 'notifications' }}</span>
        <span class="min-w-0 flex-1"><span class="flex items-center justify-between gap-3"><strong class="truncate text-[13px] text-white">{{ notification.title }}</strong><small class="shrink-0 text-[10px] text-[#97a6c3]">{{ formatDate(notification.createdAt) }}</small></span><span class="mt-1 block text-xs leading-5 text-[#b5c1da]">{{ notification.body }}</span></span>
      </button>
    </div>
    <div v-else class="paper-card mt-6 p-9 text-center text-sm text-[#b4c0d9]"><span class="material-symbols-outlined text-[36px] text-[#a993ff]" aria-hidden="true">notifications</span><p class="mt-2">Пока нет уведомлений</p></div>
  </main>
</template>
