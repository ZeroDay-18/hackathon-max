import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { questApi } from '@/services/api.js';
import { usePlayerStore } from '@/stores/player.store.js';

function replaceQuest(quests, quest) {
  const index = quests.findIndex((item) => item.id === quest.id);

  if (index === -1) {
    quests.unshift(quest);
  } else {
    quests.splice(index, 1, quest);
  }
}

export const useQuestStore = defineStore('quests', () => {
  const quests = ref([]);
  const isLoading = ref(false);
  const error = ref('');

  const activeQuests = computed(() =>
    quests.value.filter((quest) => !quest.progress?.completedAt),
  );

  const completedQuests = computed(() =>
    quests.value.filter((quest) => quest.progress?.completedAt),
  );

  async function loadQuests() {
    isLoading.value = true;
    error.value = '';

    try {
      const response = await questApi.list();
      quests.value = response.quests;
    } catch (requestError) {
      error.value = requestError.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadQuest(id) {
    const response = await questApi.getById(id);
    replaceQuest(quests.value, response.quest);
    return response.quest;
  }

  async function createQuest(payload) {
    const response = await questApi.create(payload);
    replaceQuest(quests.value, response.quest);
    return response.quest;
  }

  async function setCompleted(id, isCompleted) {
    const response = await questApi.updateProgress(id, isCompleted);
    const quest = quests.value.find((item) => item.id === Number(id));

    if (quest) {
      quest.progress = response.progress;
    }

    usePlayerStore().applyProgression(response.progression);
    return response;
  }

  async function completePomodoro(id) {
    const response = await questApi.completePomodoro(id);
    const quest = quests.value.find((item) => item.id === Number(id));

    if (quest) {
      quest.progress = response.progress;
    }

    return response.progress;
  }

  async function deleteQuest(id) {
    await questApi.remove(id);
    quests.value = quests.value.filter((quest) => quest.id !== Number(id));
  }

  return {
    quests,
    isLoading,
    error,
    activeQuests,
    completedQuests,
    loadQuests,
    loadQuest,
    createQuest,
    setCompleted,
    completePomodoro,
    deleteQuest,
  };
});
