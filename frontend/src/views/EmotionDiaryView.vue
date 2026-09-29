<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import EmotionPicker from '@/components/EmotionPicker.vue';
import { EMOTIONS_BY_CODE, QUADRANTS, QUADRANT_ACTIVITIES, getQuadrant } from '@/data/emotion-catalog.js';
import { useEmotionDiaryStore } from '@/stores/emotion-diary.store.js';

const router = useRouter();
const diary = useEmotionDiaryStore();
const editingId = ref(null);
const isFormOpen = ref(false);
const activeEntryId = ref(null);

function emptyForm() {
  return {
    entryMethod: 'thermometer', emotionCode: '', intensity: 5, valence: 3, energy: 5,
    trigger: '', occurredAt: new Date().toISOString().slice(0, 16),
  };
}
const form = reactive(emptyForm());
const selectedEmotion = computed(() => EMOTIONS_BY_CODE.get(form.emotionCode) || null);
const quadrant = computed(() => {
  if (form.entryMethod === 'thermometer') return selectedEmotion.value?.quadrant || null;
  return getQuadrant(Number(form.valence), Number(form.energy));
});
const recommendation = computed(() => quadrant.value ? QUADRANT_ACTIVITIES[quadrant.value] : []);
const valid = computed(() => Boolean(form.trigger.trim() && form.occurredAt && (form.entryMethod === 'measurement' || selectedEmotion.value)));
const summary = computed(() => diary.summary || { total: 0, distribution: {}, timeline: [] });
const timeline = computed(() => summary.value.timeline?.slice(-7) || []);

function resetForm(entry = null) {
  Object.assign(form, emptyForm(), entry ? {
    entryMethod: entry.entryMethod,
    emotionCode: entry.emotionCode || '',
    intensity: entry.intensity || 5,
    valence: entry.valence,
    energy: entry.energy,
    trigger: entry.trigger,
    occurredAt: entry.occurredAt.slice(0, 16),
  } : {});
}
function openCreate() { editingId.value = null; resetForm(); isFormOpen.value = true; }
function openEdit(entry) { editingId.value = entry.id; resetForm(entry); isFormOpen.value = true; }
function closeForm() { isFormOpen.value = false; editingId.value = null; }
function setValence(value) { form.valence = value; }
function formatDate(value, withTime = false) {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}) }).format(date);
}
function entryName(entry) { return EMOTIONS_BY_CODE.get(entry.emotionCode)?.label || QUADRANTS[entry.quadrant]?.label || 'Состояние'; }

async function save() {
  if (!valid.value) return;
  const emotion = selectedEmotion.value;
  try {
    await diary.save({
      entryMethod: form.entryMethod,
      emotionCode: emotion?.code || null,
      basicEmotionCode: emotion?.basicCode || null,
      intensity: form.entryMethod === 'thermometer' ? emotion.intensity : null,
      valence: form.entryMethod === 'thermometer' ? emotion.valence : Number(form.valence),
      energy: form.entryMethod === 'thermometer' ? emotion.energy : Number(form.energy),
      trigger: form.trigger.trim(),
      occurredAt: new Date(form.occurredAt).toISOString(),
    }, editingId.value);
    closeForm();
  } catch {
    // Store keeps the request error for the inline form message.
  }
}
async function remove(entry) {
  if (!window.confirm('Удалить эту запись? Она исчезнет из вашей динамики.')) return;
  try {
    await diary.remove(entry.id);
    if (activeEntryId.value === entry.id) activeEntryId.value = null;
  } catch {
    // The history section renders the store error without losing the entry.
  }
}

onMounted(() => diary.load());
</script>

<template>
  <main class="quest-page">
    <header class="diary-header">
      <button type="button" class="diary-back" aria-label="Назад в профиль" @click="router.back()"><span class="material-symbols-outlined" aria-hidden="true">arrow_back</span></button>
      <div><p class="text-xs font-semibold text-[#b7a4ff]">StudyQuest</p><h1 class="mt-1 text-[20px] font-extrabold text-white">Дневник эмоций</h1></div>
      <button type="button" class="diary-add" aria-label="Добавить запись" @click="openCreate"><span class="material-symbols-outlined" aria-hidden="true">add</span></button>
    </header>

    <div class="space-y-4 px-4 pb-7">
      <section v-if="isFormOpen" class="paper-card p-4">
        <div class="flex items-start justify-between gap-3"><div><p class="text-xs font-semibold text-[#b9a7ff]">Новая запись</p><h2 class="mt-1 text-[17px] font-extrabold text-white">{{ editingId ? 'Измените состояние' : 'Как вы сейчас?' }}</h2></div><button type="button" class="text-[#aebbd7]" aria-label="Закрыть форму" @click="closeForm"><span class="material-symbols-outlined" aria-hidden="true">close</span></button></div>
        <div class="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-[#071128]/60 p-1">
          <button type="button" class="diary-mode" :class="{ 'is-active': form.entryMethod === 'thermometer' }" @click="form.entryMethod = 'thermometer'">Назвать эмоцию</button>
          <button type="button" class="diary-mode" :class="{ 'is-active': form.entryMethod === 'measurement' }" @click="form.entryMethod = 'measurement'">Оценить состояние</button>
        </div>

        <template v-if="form.entryMethod === 'thermometer'">
          <p class="mt-5 text-sm font-bold text-white">Выберите то, что ближе всего</p>
          <p class="mt-1 text-xs leading-relaxed text-[#adbad5]">Сначала выберите группу, затем уточните ощущение.</p>
          <div class="mt-3"><EmotionPicker v-model="form.emotionCode" /></div>
          <p v-if="selectedEmotion" class="mt-4 rounded-xl border border-[#b9a7ff]/20 bg-[#7657e8]/12 px-3 py-2 text-xs text-[#d8ceff]">Выбрано состояние с силой {{ selectedEmotion.intensity }}/10.</p>
        </template>

        <template v-else>
          <section class="mt-5"><p class="text-sm font-bold text-white">Насколько это ощущение приятно?</p><div class="mt-3 grid grid-cols-2 gap-2"><button type="button" class="diary-choice diary-choice--negative" :class="{ 'is-selected': form.valence < 0 }" @click="setValence(-3)"><span class="material-symbols-outlined" aria-hidden="true">sentiment_dissatisfied</span>Неприятно</button><button type="button" class="diary-choice diary-choice--positive" :class="{ 'is-selected': form.valence > 0 }" @click="setValence(3)"><span class="material-symbols-outlined" aria-hidden="true">sentiment_satisfied</span>Приятно</button></div></section>
          <label class="mt-5 block text-sm font-bold text-white">Уровень энергии <span class="float-right text-[#c9b9ff]">{{ form.energy }}/10</span><input v-model.number="form.energy" class="diary-range" type="range" min="1" max="10"></label>
        </template>

        <label class="mt-5 block text-sm font-bold text-white">Что вызвало это состояние?<textarea v-model="form.trigger" class="quest-field mt-2 min-h-24 resize-none text-sm font-normal" maxlength="1000" placeholder="Например: подготовка к экзамену или разговор с другом" /></label>
        <label class="mt-4 block text-sm font-bold text-white">Когда?<input v-model="form.occurredAt" class="quest-field mt-2 text-sm font-normal" type="datetime-local"></label>

        <section v-if="quadrant" class="diary-recommendation mt-5" :class="`diary-recommendation--${quadrant}`"><div class="flex items-center gap-2"><span class="material-symbols-outlined" aria-hidden="true">{{ QUADRANTS[quadrant].icon }}</span><div><p class="text-[11px] font-semibold uppercase tracking-wide text-[#b9c6de]">Подходящая активность</p><p class="text-sm font-extrabold text-white">{{ QUADRANTS[quadrant].label }}</p></div></div><ul class="mt-3 space-y-1.5 text-xs text-[#d6e0f4]"><li v-for="activity in recommendation" :key="activity">• {{ activity }}</li></ul></section>
        <p v-if="diary.error" class="mt-3 rounded-xl border border-[#ff9fb3]/25 bg-[#7c263a]/25 p-3 text-sm text-[#ffd0da]">{{ diary.error }}</p>
        <p v-if="!valid" class="mt-3 text-xs text-[#aebbd3]">Выберите состояние, укажите причину и время.</p>
        <button type="button" class="quest-action mt-5 w-full py-3.5" :disabled="!valid || diary.isSaving" @click="save"><span class="material-symbols-outlined" aria-hidden="true">save</span>{{ diary.isSaving ? 'Сохраняю…' : 'Сохранить запись' }}</button>
      </section>

      <template v-else>
        <section class="paper-card p-4"><div class="flex items-start justify-between gap-4"><div><p class="text-[11px] font-semibold uppercase tracking-wide text-[#b7a7f0]">Ваше состояние</p><p class="mt-1 text-[17px] font-extrabold text-white">{{ diary.latestEntry ? entryName(diary.latestEntry) : 'Отметьте первое наблюдение' }}</p><p class="mt-1 text-xs text-[#aab9d3]">{{ diary.latestEntry ? formatDate(diary.latestEntry.occurredAt, true) : 'Это займёт меньше минуты' }}</p></div><button type="button" class="diary-round-action" aria-label="Записать состояние" @click="openCreate"><span class="material-symbols-outlined" aria-hidden="true">add_reaction</span></button></div><button type="button" class="quest-action mt-4 w-full py-3" @click="openCreate">Записать состояние</button></section>

        <section class="paper-card p-4"><div class="flex items-center justify-between gap-3"><div><p class="text-[11px] font-semibold uppercase tracking-wide text-[#b7a7f0]">Динамика</p><h2 class="mt-1 text-[16px] font-extrabold text-white">Ваши наблюдения</h2></div><div class="flex rounded-xl bg-[#071128]/60 p-1"><button v-for="value in ['7d', '30d']" :key="value" type="button" class="diary-period" :class="{ 'is-active': diary.period === value }" @click="diary.changePeriod(value)">{{ value === '7d' ? '7 дней' : '30 дней' }}</button></div></div><div class="mt-4 grid grid-cols-7 gap-1.5" role="list" aria-label="Энергия в последние дни"><div v-for="point in timeline" :key="point.date" class="min-w-0 text-center" role="listitem"><div class="flex h-19 items-end rounded-lg bg-[#071128]/65 p-1"><div v-if="point.energy !== null" class="w-full rounded-md bg-gradient-to-t from-[#7050e6] to-[#7db7fb]" :style="{ height: `${Math.max(12, point.energy * 10)}%` }" :title="`${formatDate(point.date)}: энергия ${Math.round(point.energy)}/10`" /><span v-else class="mx-auto mb-1 text-[10px] text-[#74809d]">—</span></div><span class="mt-1 block truncate text-[9px] text-[#91a0c0]">{{ formatDate(point.date).split(' ')[0] }}</span></div></div><div class="mt-4 grid grid-cols-2 gap-2"><div v-for="(meta, key) in QUADRANTS" :key="key" class="diary-quadrant-stat" :class="`diary-quadrant-stat--${key}`"><span class="material-symbols-outlined" aria-hidden="true">{{ meta.icon }}</span><span class="min-w-0 text-[10px] font-bold leading-tight">{{ meta.label }}</span><strong>{{ summary.distribution?.[key] || 0 }}</strong></div></div></section>

        <section><div class="flex items-center justify-between px-1"><div><h2 class="text-sm font-extrabold text-white">История записей</h2><p v-if="diary.hasMore" class="mt-0.5 text-[10px] text-[#91a0c0]">Показаны последние 100 записей</p></div><span class="text-xs text-[#aebbd6]">{{ diary.entries.length }}</span></div><p v-if="diary.error" class="mt-3 rounded-xl border border-[#ff9fb3]/25 bg-[#7c263a]/25 p-3 text-sm text-[#ffd0da]">{{ diary.error }}</p><div v-else-if="diary.isLoading" class="mt-3 space-y-2"><div v-for="item in 3" :key="item" class="h-22 animate-pulse rounded-2xl bg-[#243052]/60" /></div><p v-else-if="!diary.entries.length" class="paper-subtle mt-3 p-5 text-center text-sm text-[#abb9d4]">Записей пока нет. Начните с короткого наблюдения о себе.</p><ul v-else class="mt-3 space-y-2"><li v-for="entry in diary.entries" :key="entry.id"><article class="paper-card p-3.5"><div class="flex items-start justify-between gap-3"><button type="button" class="min-w-0 text-left" @click="activeEntryId = activeEntryId === entry.id ? null : entry.id"><p class="truncate text-sm font-extrabold text-white">{{ entryName(entry) }}</p><p class="mt-1 text-xs text-[#aebbd3]">{{ formatDate(entry.occurredAt, true) }} · энергия {{ entry.energy }}/10</p></button><div class="flex shrink-0"><button type="button" class="diary-icon-button" aria-label="Изменить" @click="openEdit(entry)"><span class="material-symbols-outlined" aria-hidden="true">edit</span></button><button type="button" class="diary-icon-button text-[#ffadbc]" aria-label="Удалить" @click="remove(entry)"><span class="material-symbols-outlined" aria-hidden="true">delete</span></button></div></div><p v-if="activeEntryId === entry.id" class="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-[#cad5ea]">{{ entry.trigger }}</p></article></li></ul></section>
      </template>
      <p class="px-2 text-center text-[11px] leading-relaxed text-[#8e9bb7]">Дневник помогает замечать своё состояние, но не заменяет профессиональную помощь.</p>
    </div>
  </main>
</template>

<style scoped>
.diary-header { display: grid; grid-template-columns: 40px minmax(0, 1fr) 40px; align-items: center; gap: 10px; padding: max(22px, env(safe-area-inset-top)) 16px 22px; background: rgb(12 20 40 / 82%); backdrop-filter: blur(14px); }
.diary-back, .diary-add, .diary-icon-button, .diary-round-action { display: grid; place-items: center; border: 1px solid rgb(185 199 239 / 18%); color: #d5e0f5; background: rgb(255 255 255 / 6%); }
.diary-back, .diary-add { width: 40px; height: 40px; border-radius: 13px; }.diary-add { color: white; background: linear-gradient(145deg, #7657e8, #527ce4); }.diary-mode { border-radius: 9px; padding: 10px 6px; color: #aebbd4; font-size: 12px; font-weight: 750; }.diary-mode.is-active, .diary-period.is-active { color: white; background: #443473; box-shadow: 0 3px 10px rgb(0 0 0 / 20%); }.diary-range { width: 100%; margin-top: 9px; accent-color: #a98bff; }.diary-choice { display: flex; align-items: center; justify-content: center; gap: 6px; border: 1px solid rgb(185 199 239 / 15%); border-radius: 13px; padding: 12px 6px; color: #c4d1e9; background: rgb(255 255 255 / 4%); font-size: 12px; font-weight: 750; }.diary-choice.is-selected { border-color: #aa89fd; color: white; background: rgb(117 79 230 / 28%); }.diary-recommendation { border: 1px solid rgb(190 205 239 / 15%); border-radius: 15px; padding: 13px; background: rgb(255 255 255 / 5%); }.diary-recommendation--blue { box-shadow: inset 3px 0 #67a9ed; }.diary-recommendation--green { box-shadow: inset 3px 0 #72d3a0; }.diary-recommendation--red { box-shadow: inset 3px 0 #fd8b9e; }.diary-recommendation--yellow { box-shadow: inset 3px 0 #f2c66a; }.diary-round-action { width: 43px; height: 43px; flex: none; border-color: #9678ef; color: #d8caff; background: rgb(117 80 227 / 24%); }.diary-period { border-radius: 9px; padding: 6px 8px; color: #aebbd4; font-size: 11px; font-weight: 750; }.diary-quadrant-stat { display: grid; grid-template-columns: 18px minmax(0, 1fr) auto; align-items: center; gap: 5px; border: 1px solid rgb(188 202 238 / 11%); border-radius: 11px; padding: 8px; color: #ced9ec; background: rgb(255 255 255 / 4%); }.diary-quadrant-stat strong { color: white; font-size: 15px; }.diary-quadrant-stat--blue .material-symbols-outlined { color: #75b5f4; }.diary-quadrant-stat--green .material-symbols-outlined { color: #7ddaa9; }.diary-quadrant-stat--red .material-symbols-outlined { color: #ffa1af; }.diary-quadrant-stat--yellow .material-symbols-outlined { color: #f7d27b; }.diary-icon-button { width: 31px; height: 31px; border-color: transparent; background: transparent; }
</style>
