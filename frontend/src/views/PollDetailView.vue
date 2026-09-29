<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { pollApi } from '@/services/api.js';
import { useQuestStore } from '@/stores/quest.store.js';
import { usePlayerStore } from '@/stores/player.store.js';

const playerStore = usePlayerStore();
const rewardNotice = ref('');

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const questStore = useQuestStore();
const quest = ref(null);
const error = ref('');
const isVoting = ref(false);
const totalVotes = computed(() => quest.value?.poll?.totalVotes || 0);

async function load() {
  error.value = '';
  try { quest.value = await questStore.loadQuest(route.params.id); } catch (requestError) { error.value = requestError.message; }
}

async function vote(optionId) {
  if (!quest.value || isVoting.value) return;
  isVoting.value = true;
  try {
    const response = await pollApi.vote(quest.value.id, optionId);
    quest.value.poll = response.poll;
    playerStore.applyProgression(response.progression);
    if (response.xpAwarded) rewardNotice.value = '+' + response.xpAwarded + ' XP';
  } catch (requestError) { error.value = requestError.message; } finally { isVoting.value = false; }
}

function percent(option) { return totalVotes.value ? Math.round((option.votes / totalVotes.value) * 100) : 0; }
onMounted(load);
</script>

<template>
  <main class="quest-page quest-page--plain">
    <header class="flex items-center justify-between"><button type="button" class="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white" aria-label="Назад" @click="router.back()"><span class="material-symbols-outlined" aria-hidden="true">arrow_back</span></button><h1 class="text-lg font-extrabold text-white">{{ t('quests.types.poll') }}</h1><span class="h-9 w-9" /></header>
    <p v-if="!quest && !error" class="paper-card mt-6 p-8 text-center text-sm text-[#b4c0d9]">Загрузка…</p>
    <div v-if="error" class="paper-card mt-6 p-4 text-sm text-[#ffb7c4]">{{ error }} <button type="button" class="ml-2 underline" @click="load">Повторить</button></div>
    <template v-if="quest?.poll">
      <section class="mt-6 overflow-hidden rounded-[20px] border border-[#876cf0]/40 bg-[#201b51] p-5 shadow-[0_13px_28px_#100a3670]">
        <span class="material-symbols-outlined grid h-12 w-12 place-items-center rounded-xl bg-[#6e50dd] text-[25px] text-white" aria-hidden="true">how_to_vote</span>
        <p class="mt-4 text-xs font-semibold text-[#d2c6ff]">{{ quest.group?.name }}</p>
        <h2 class="mt-1 text-xl font-extrabold leading-snug text-white">{{ quest.poll.question }}</h2>
      </section>
      <section class="paper-card mt-4 p-4">
        <div class="space-y-3">
          <button v-for="option in quest.poll.options" :key="option.id" type="button" class="relative w-full overflow-hidden rounded-xl border p-3 text-left transition" :class="option.selected ? 'border-[#966ff5] bg-[#4b357f]/60' : 'border-white/10 bg-[#071128]/40 hover:border-[#6f5cc4]'" :disabled="isVoting" @click="vote(option.id)">
            <span class="absolute inset-y-0 left-0 bg-[#8569ed]/25" :style="{ width: `${percent(option)}%` }" />
            <span class="relative flex items-center gap-3"><span class="material-symbols-outlined text-[20px]" :class="option.selected ? 'text-[#c3b1ff]' : 'text-[#8f9fbe]'" aria-hidden="true">{{ option.selected ? 'radio_button_checked' : 'radio_button_unchecked' }}</span><span class="min-w-0 flex-1 text-sm font-semibold text-white">{{ option.text }}</span><span class="text-xs font-bold text-[#d4cbf6]">{{ percent(option) }}%</span></span>
          </button>
        </div>
        <p class="mt-4 text-center text-xs text-[#aebbd6]">Ответили: {{ totalVotes }}</p>
        <p v-if="rewardNotice" class="mt-3 text-center text-sm font-bold text-[#a9f0c2]">{{ rewardNotice }}</p>
      </section>
    </template>
  </main>
</template>
