<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AvatarFrame from '@/components/AvatarFrame.vue';
import { useAuthStore } from '@/stores/auth.store.js';
import { useQuestStore } from '@/stores/quest.store.js';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const questStore = useQuestStore();
const quest = ref(null);
const xpAwarded = Number(route.query.xp) || 0;
const fullName = [authStore.user?.firstName, authStore.user?.lastName].filter(Boolean).join(' ');
onMounted(async () => { quest.value = await questStore.loadQuest(route.params.id).catch(() => null); });
</script>

<template>
  <main class="reward-page"><div class="reward-sparkles" aria-hidden="true" /><section class="relative z-10 mx-auto flex min-h-dvh max-w-[440px] flex-col items-center justify-center px-5 text-center"><AvatarFrame :name="fullName" :seed="authStore.user?.avatarSeed || authStore.user?.maxId" class="h-28 w-28 text-4xl" /><span class="material-symbols-outlined mt-5 text-[50px] text-[#ffe38a] drop-shadow-[0_0_17px_#f5b947]" aria-hidden="true">stars</span><h1 class="mt-2 text-3xl font-black text-white">Квест выполнен!</h1><p class="mt-2 text-sm text-[#d4def4]">{{ quest?.title || 'Задание' }}</p><p v-if="xpAwarded" class="mt-6 rounded-2xl border border-[#f4c75a]/50 bg-[#624b22]/50 px-5 py-3 text-lg font-black text-[#ffe28b] shadow-[0_0_20px_#f5b94733]">+{{ xpAwarded }} XP</p><div class="mt-7 w-full rounded-2xl border border-white/12 bg-[#14213b]/84 p-4 text-left backdrop-blur"><p class="text-[11px] font-bold text-[#adb9d5]">Новая награда</p><div class="mt-3 flex items-center gap-3"><span class="material-symbols-outlined grid h-11 w-11 place-items-center rounded-xl bg-[#704f24] text-[#ffe094]" aria-hidden="true">auto_awesome</span><div><p class="font-bold text-white">Опыт путешественника</p><p class="mt-0.5 text-xs text-[#c6d2e8]">Прогресс сохранён в профиле</p></div></div></div><button type="button" class="quest-action mt-8 w-full px-5 py-3.5" @click="router.replace({ name: 'dashboard' })">Продолжить</button></section></main>
</template>
<!-- - -->
<style scoped>
.reward-page { min-height: 100dvh; background: radial-gradient(circle at 50% 40%, #2b1f69 0%, #111b36 46%, #080d1d 100%); overflow: hidden; }.reward-sparkles { position: fixed; inset: 0; background-image: radial-gradient(#ffe18a 1.5px, transparent 2px), radial-gradient(#9174ff 1px, transparent 1.5px); background-position: 20px 30px, 80px 130px; background-size: 80px 85px, 120px 115px; opacity: .72; }
</style>
