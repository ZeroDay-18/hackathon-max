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

  if (nextScope === 'personal' && type.value === 'poll') {
    type.value = 'personal';
  }

  if (nextScope === 'group' && type.value === 'personal') {
    type.value = 'homework';
  }
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
  <main class="mx-auto min-h-dvh max-w-md bg-[#070913] px-4 pb-8 pt-[max(1rem,env(safe-area-inset-top))] text-slate-100">
    <header class="flex items-center gap-3">
      <button
        type="button"
        class="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 text-slate-300 hover:bg-white/10"
        :aria-label="t('common.back')"
        @click="router.back()"
      >
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 class="text-xl font-bold text-white">{{ t('createQuest.title') }}</h1>
    </header>

    <form class="mt-7 space-y-5" @submit.prevent="submit">
      <label class="block">
        <span class="mb-2 block text-sm font-medium text-slate-200">{{ t('createQuest.titleLabel') }}</span>
        <input
          v-model="title"
          type="text"
          maxlength="255"
          class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400"
          :placeholder="t('createQuest.titlePlaceholder')"
        >
      </label>

      <label class="block">
        <span class="mb-2 block text-sm font-medium text-slate-200">{{ t('createQuest.descriptionLabel') }}</span>
        <textarea
          v-model="description"
          rows="4"
          class="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400"
          :placeholder="t('createQuest.descriptionPlaceholder')"
        />
      </label>

      <fieldset>
        <legend class="mb-2 text-sm font-medium text-slate-200">{{ t('createQuest.scopeLabel') }}</legend>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="option in ['group', 'personal']"
            :key="option"
            type="button"
            class="rounded-2xl border px-3 py-3 text-sm font-medium transition"
            :class="scope === option ? 'border-violet-400 bg-violet-500/20 text-white' : 'border-white/10 bg-white/5 text-slate-400'"
            @click="setScope(option)"
          >
            {{ t(`createQuest.${option === 'group' ? 'forGroup' : 'personal'}`) }}
            <span v-if="option === 'group' && authStore.user?.group?.name" class="mt-1 block truncate text-xs opacity-70">{{ authStore.user.group.name }}</span>
          </button>
        </div>
      </fieldset>

      <label class="block">
        <span class="mb-2 block text-sm font-medium text-slate-200">{{ t('createQuest.typeLabel') }}</span>
        <select v-model="type" class="w-full rounded-2xl border border-white/10 bg-[#121726] px-4 py-3 text-sm text-white outline-none focus:border-violet-400">
          <option v-for="item in visibleTypes" :key="item" :value="item">{{ t(`quests.types.${item}`) }}</option>
        </select>
      </label>

      <label class="block">
        <span class="mb-2 block text-sm font-medium text-slate-200">{{ t('createQuest.deadlineLabel') }}</span>
        <input v-model="deadline" type="datetime-local" class="w-full rounded-2xl border border-white/10 bg-[#121726] px-4 py-3 text-sm text-white outline-none focus:border-violet-400">
      </label>

      <p v-if="formError" class="rounded-2xl bg-rose-500/10 p-3 text-sm text-rose-200">{{ formError }}</p>

      <button
        type="submit"
        class="w-full rounded-2xl bg-violet-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? t('common.loading') : t('createQuest.submit') }}
      </button>
    </form>
  </main>
</template>
