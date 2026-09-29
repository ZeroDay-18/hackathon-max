<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import AvatarFrame from '@/components/AvatarFrame.vue';
import { useAuthStore } from '@/stores/auth.store.js';

const router = useRouter();
const authStore = useAuthStore();
const fullName = computed(() => [authStore.user?.firstName, authStore.user?.lastName].filter(Boolean).join(' '));
</script>

<template>
  <main class="onboarding-page">
    <div class="onboarding-stars" aria-hidden="true" />
    <section class="onboarding-card text-center">
      <div class="brand-mark mx-auto"><span class="material-symbols-outlined text-[33px]" aria-hidden="true">auto_stories</span></div>
      <AvatarFrame :name="fullName" :seed="authStore.user?.avatarSeed || authStore.user?.maxId" class="mx-auto mt-8 h-[78px] w-[78px] text-3xl" />
      <p class="mt-6 text-sm text-[#b8cae9]">Добро пожаловать,</p>
      <h1 class="mt-1 text-[26px] font-black tracking-tight text-white">{{ fullName }}</h1>
      <p class="mx-auto mt-4 max-w-[290px] text-sm leading-6 text-[#c7d4ec]">Здесь задания превращаются в понятный маршрут: сроки, фокус и прогресс — в одном месте.</p>
      <div class="onboarding-steps mt-8"><span class="is-active" /><span /><span /></div>
      <button type="button" class="onboarding-primary mt-7 w-full" @click="router.push({ name: 'style-choice' })">Настроить приложение</button>
    </section>
  </main>
</template>
