import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { emotionDiaryApi } from '@/services/api.js';

export const useEmotionDiaryStore = defineStore('emotion-diary', () => {
  const entries = ref([]);
  const summary = ref(null);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref('');
  const period = ref('7d');
  const hasMore = ref(false);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  const latestEntry = computed(() => entries.value[0] || null);

  async function load() {
    isLoading.value = true;
    error.value = '';
    try {
      const [entriesResponse, summaryResponse] = await Promise.all([
        emotionDiaryApi.list(),
        emotionDiaryApi.summary(period.value, timezone),
      ]);
      entries.value = entriesResponse.entries;
      hasMore.value = entriesResponse.hasMore;
      summary.value = summaryResponse.summary;
    } catch (requestError) {
      error.value = requestError.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function changePeriod(value) {
    period.value = value;
    try {
      summary.value = (await emotionDiaryApi.summary(value, timezone)).summary;
    } catch (requestError) {
      error.value = requestError.message;
    }
  }

  async function save(payload, entryId = null) {
    isSaving.value = true;
    error.value = '';
    try {
      const response = entryId
        ? await emotionDiaryApi.update(entryId, payload)
        : await emotionDiaryApi.create(payload);
      const entry = response.entry;
      const index = entries.value.findIndex((item) => item.id === entry.id);
      if (index >= 0) entries.value.splice(index, 1, entry);
      else entries.value.unshift(entry);
      entries.value.sort((left, right) => new Date(right.occurredAt) - new Date(left.occurredAt));
      summary.value = (await emotionDiaryApi.summary(period.value, timezone)).summary;
      return entry;
    } catch (requestError) {
      error.value = requestError.message;
      throw requestError;
    } finally {
      isSaving.value = false;
    }
  }

  async function remove(entryId) {
    isSaving.value = true;
    error.value = '';
    try {
      await emotionDiaryApi.remove(entryId);
      entries.value = entries.value.filter((entry) => entry.id !== entryId);
      summary.value = (await emotionDiaryApi.summary(period.value, timezone)).summary;
    } catch (requestError) {
      error.value = requestError.message;
      throw requestError;
    } finally {
      isSaving.value = false;
    }
  }

  return { entries, summary, isLoading, isSaving, error, period, hasMore, latestEntry, load, changePeriod, save, remove };
});
