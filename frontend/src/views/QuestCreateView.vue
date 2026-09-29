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
const subject = ref('');
const type = ref('homework');
const scope = ref('group');
const deadline = ref('');
const pollQuestion = ref('');
const pollOptions = ref(['', '']);
const formError = ref('');
const isSubmitting = ref(false);

const visibleTypes = computed(() => scope.value === 'personal'
  ? questTypes.filter((item) => item !== 'poll')
  : questTypes.filter((item) => item !== 'personal'));

function setScope(nextScope) {
  scope.value = nextScope;
  if (nextScope === 'personal' && type.value === 'poll') type.value = 'personal';
  if (nextScope === 'group' && type.value === 'personal') type.value = 'homework';
}

function addPollOption() {
  if (pollOptions.value.length < 6) pollOptions.value.push('');
}

function removePollOption(index) {
  if (pollOptions.value.length > 2) pollOptions.value.splice(index, 1);
}

async function submit() {
  formError.value = '';
  const options = pollOptions.value.map((option) => option.trim()).filter(Boolean);

  if (!title.value.trim()) {
    formError.value = t('createQuest.required');
    return;
  }
  if (type.value === 'poll' && (!pollQuestion.value.trim() || options.length < 2)) {
    formError.value = 'Добавьте вопрос и минимум два варианта ответа.';
    return;
  }

  isSubmitting.value = true;
  try {
    const quest = await questStore.createQuest({
      title: title.value,
      description: description.value,
      subject: subject.value,
      type: type.value,
      scope: scope.value,
      deadline: deadline.value ? new Date(deadline.value).toISOString() : null,
      ...(type.value === 'poll' && { pollQuestion: pollQuestion.value, pollOptions: options }),
    });
    router.replace({ name: type.value === 'poll' ? 'poll-detail' : 'quest-detail', params: { id: quest.id } });
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
      <button type="button" class="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white" :aria-label="t('common.back')" @click="router.back()"><span class="material-symbols-outlined" aria-hidden="true">arrow_back</span></button>
      <h1 class="text-[18px] font-extrabold text-white">{{ t('createQuest.title') }}</h1>
    </header>

    <form class="paper-card mt-5 space-y-5 p-4" @submit.prevent="submit">
      <div class="flex items-center gap-3 border-b border-white/10 pb-4"><span class="material-symbols-outlined grid h-11 w-11 place-items-center rounded-xl bg-[#3e307c] text-[#c7b5ff]" aria-hidden="true">auto_stories</span><p class="text-sm font-bold text-white">{{ t('createQuest.title') }}</p></div>
      <label class="block"><span class="mb-2 block text-[12px] font-bold text-[#d6def1]">{{ t('createQuest.titleLabel') }}</span><input v-model="title" type="text" maxlength="255" class="quest-field text-sm" :placeholder="t('createQuest.titlePlaceholder')"></label>
      <fieldset><legend class="mb-2 text-[12px] font-bold text-[#d6def1]">{{ t('createQuest.scopeLabel') }}</legend><div class="grid grid-cols-2 gap-2"><button v-for="option in ['group', 'personal']" :key="option" type="button" class="rounded-xl border p-2.5 text-left text-[12px] font-bold transition" :class="scope === option ? 'border-[#997df4] bg-[#413377] text-white' : 'border-white/10 bg-[#071128]/40 text-[#b1bed7]'" :aria-pressed="scope === option" @click="setScope(option)">{{ t(`createQuest.${option === 'group' ? 'forGroup' : 'personal'}`) }}<span v-if="option === 'group' && authStore.user?.group?.name" class="mt-1 block truncate text-[11px] font-normal opacity-75">{{ authStore.user.group.name }}</span></button></div></fieldset>
      <label class="block"><span class="mb-2 block text-[12px] font-bold text-[#d6def1]">Предмет</span><input v-model="subject" type="text" maxlength="120" class="quest-field text-sm" placeholder="Например, информатика"></label>
      <label class="block"><span class="mb-2 block text-[12px] font-bold text-[#d6def1]">{{ t('createQuest.typeLabel') }}</span><select v-model="type" class="quest-field text-sm"><option v-for="item in visibleTypes" :key="item" :value="item">{{ t(`quests.types.${item}`) }}</option></select></label>
      <template v-if="type === 'poll'"><label class="block"><span class="mb-2 block text-[12px] font-bold text-[#d6def1]">Вопрос</span><input v-model="pollQuestion" type="text" maxlength="500" class="quest-field text-sm" placeholder="Например, когда провести встречу?"></label><div><div class="mb-2 flex items-center justify-between"><span class="text-[12px] font-bold text-[#d6def1]">Варианты ответа</span><button type="button" class="text-xs font-bold text-[#baa7ff]" @click="addPollOption">+ Добавить</button></div><div class="space-y-2"><div v-for="(_, index) in pollOptions" :key="index" class="flex gap-2"><input v-model="pollOptions[index]" type="text" :placeholder="`Вариант ${index + 1}`" class="quest-field text-sm"><button v-if="pollOptions.length > 2" type="button" class="grid w-10 place-items-center rounded-xl bg-[#43243a] text-[#ffbbc7]" aria-label="Удалить вариант" @click="removePollOption(index)"><span class="material-symbols-outlined text-lg" aria-hidden="true">close</span></button></div></div></div></template>
      <label class="block"><span class="mb-2 block text-[12px] font-bold text-[#d6def1]">{{ t('createQuest.descriptionLabel') }}</span><textarea v-model="description" rows="4" class="quest-field resize-none text-sm" :placeholder="t('createQuest.descriptionPlaceholder')" /></label>
      <label class="block"><span class="mb-2 block text-[12px] font-bold text-[#d6def1]">{{ t('createQuest.deadlineLabel') }}</span><input v-model="deadline" type="datetime-local" class="quest-field text-sm"></label>
      <p v-if="formError" class="rounded-xl bg-[#4b2139] p-3 text-sm text-[#ffc3cf]" role="alert">{{ formError }}</p>
      <button type="submit" class="quest-action w-full px-4 py-3 text-sm" :disabled="isSubmitting">{{ isSubmitting ? t('common.loading') : t('createQuest.submit') }}</button>
    </form>
  </main>
</template>
