<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth.store.js';
import { useQuestStore } from '@/stores/quest.store.js';
import { questTypes } from '@/utils/quest.js';

const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();
const questStore = useQuestStore();
const title = ref('');
const description = ref('');
const type = ref('homework');
const scope = ref('group');
const deadline = ref('');
const formError = ref('');
const isSubmitting = ref(false);

const visibleTypes = computed(() => scope.value === 'personal'
  ? questTypes.filter((item) => item !== 'poll')
  : questTypes.filter((item) => item !== 'personal'),
);

function setScope(nextScope) {
  scope.value = nextScope;
  if (nextScope === 'personal' && type.value === 'poll') type.value = 'personal';
  if (nextScope === 'group' && type.value === 'personal') type.value = 'homework';
}

async function submit() {
  formError.value = '';
  if (!title.value.trim()) {
    formError.value = t('createQuest.required');
    return;
  }

  isSubmitting.value = true;
  try {
    const quest = await questStore.createQuest({
      title: title.value,
      description: description.value,
      type: type.value,
      scope: scope.value,
      deadline: deadline.value ? new Date(deadline.value).toISOString() : null,
    });
    router.replace({ name: 'quest-detail', params: { id: quest.id } });
  } catch (error) {
    formError.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <main class="quest-page quest-page--plain">
    <header class="flex items-center gap-3">
      <button type="button" class="grid h-9 w-9 place-items-center rounded-lg bg-[#e5e8f2] text-[#253451]" :aria-label="t('common.back')" @click="router.back()">
        <span class="material-symbols-outlined text-xl" aria-hidden="true">arrow_back</span>
      </button>
      <h1 class="text-[18px] font-extrabold text-[#1b2847]">{{ t('createQuest.title') }}</h1>
    </header>

    <form class="paper-card mt-5 space-y-5 p-4" @submit.prevent="submit">
      <div class="flex items-center gap-3 border-b border-[#e7eaf3] pb-4">
        <span class="material-symbols-outlined grid h-11 w-11 place-items-center rounded-xl bg-[#eee8ff] text-[#6749ce]" aria-hidden="true">auto_stories</span>
        <p class="text-sm font-bold text-[#1b2847]">{{ t('createQuest.title') }}</p>
      </div>
      <label class="block">
        <span class="mb-2 block text-[12px] font-bold text-[#34405b]">{{ t('createQuest.titleLabel') }}</span>
        <input v-model="title" type="text" maxlength="255" class="quest-field text-sm" :placeholder="t('createQuest.titlePlaceholder')">
      </label>
      <fieldset>
        <legend class="mb-2 text-[12px] font-bold text-[#34405b]">{{ t('createQuest.scopeLabel') }}</legend>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="option in ['group', 'personal']"
            :key="option"
            type="button"
            class="rounded-xl border p-2.5 text-left text-[12px] font-bold transition"
            :class="scope === option ? 'border-[#8e76ee] bg-[#eeeaff] text-[#543cb1]' : 'border-[#e0e4ed] bg-[#f8f9fd] text-[#65718a]'"
            :aria-pressed="scope === option"
            @click="setScope(option)"
          >
            {{ t(`createQuest.${option === 'group' ? 'forGroup' : 'personal'}`) }}
            <span v-if="option === 'group' && authStore.user?.group?.name" class="mt-1 block truncate text-[11px] font-normal">{{ authStore.user.group.name }}</span>
          </button>
        </div>
      </fieldset>
      <label class="block">
        <span class="mb-2 block text-[12px] font-bold text-[#34405b]">{{ t('createQuest.typeLabel') }}</span>
        <select v-model="type" class="quest-field text-sm">
          <option v-for="item in visibleTypes" :key="item" :value="item">{{ t(`quests.types.${item}`) }}</option>
        </select>
      </label>
      <label class="block">
        <span class="mb-2 block text-[12px] font-bold text-[#34405b]">{{ t('createQuest.descriptionLabel') }}</span>
        <textarea v-model="description" rows="4" class="quest-field resize-none text-sm" :placeholder="t('createQuest.descriptionPlaceholder')" />
      </label>
      <label class="block">
        <span class="mb-2 block text-[12px] font-bold text-[#34405b]">{{ t('createQuest.deadlineLabel') }}</span>
        <input v-model="deadline" type="datetime-local" class="quest-field text-sm">
      </label>
      <p v-if="formError" class="rounded-xl bg-[#fff0f0] p-3 text-sm text-[#ae3549]" role="alert">{{ formError }}</p>
      <button type="submit" class="quest-action w-full px-4 py-3 text-sm" :disabled="isSubmitting">
        {{ isSubmitting ? t('common.loading') : t('createQuest.submit') }}
      </button>
    </form>
  </main>
</template>
