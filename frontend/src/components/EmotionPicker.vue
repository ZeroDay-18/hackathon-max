<script setup>
import { computed } from 'vue';
import { EMOTION_GROUPS } from '@/data/emotion-catalog.js';

const props = defineProps({ modelValue: { type: String, default: '' } });
const emit = defineEmits(['update:modelValue']);

const selectedGroup = computed(() => EMOTION_GROUPS.find((group) => group.emotions.some((emotion) => emotion.code === props.modelValue)) || null);

function selectGroup(group) {
  emit('update:modelValue', group.emotions[1].code);
}
</script>

<template>
  <div>
    <div class="emotion-picker-grid" role="group" aria-label="Выберите базовую эмоцию">
      <button v-for="group in EMOTION_GROUPS" :key="group.code" type="button" class="emotion-picker-tile" :class="{ 'is-selected': selectedGroup?.code === group.code }" :aria-pressed="selectedGroup?.code === group.code" @click="selectGroup(group)">
        <span class="material-symbols-outlined emotion-picker-tile__icon" aria-hidden="true">{{ group.icon }}</span>
        <span class="emotion-picker-tile__label">{{ group.label }}</span>
      </button>
    </div>

    <section v-if="selectedGroup" class="mt-4 rounded-2xl border border-[#b8c8ee]/15 bg-[#071128]/55 p-3">
      <p class="text-xs font-semibold text-[#afbdd9]">Уточните ощущение</p>
      <div class="mt-2 grid grid-cols-3 gap-2">
        <button v-for="emotion in selectedGroup.emotions" :key="emotion.code" type="button" class="emotion-level" :class="{ 'is-selected': modelValue === emotion.code }" :aria-pressed="modelValue === emotion.code" @click="emit('update:modelValue', emotion.code)">
          <span class="block text-[11px] leading-tight">{{ emotion.label }}</span>
          <span class="mt-1 block text-[10px] text-[#aebbd6]">{{ emotion.intensity }}/10</span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.emotion-picker-grid { display: grid; width: 100%; max-width: 100%; min-width: 0; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.emotion-picker-tile { display: flex; width: 100%; min-width: 0; min-height: 84px; flex-direction: column; align-items: center; justify-content: center; gap: 6px; border: 1px solid rgb(184 200 238 / 14%); border-radius: 15px; padding: 8px 4px; color: #c8d5ee; background: rgb(9 18 39 / 54%); }
.emotion-picker-tile.is-selected { border-color: #ad8aff; color: white; background: linear-gradient(145deg, rgb(115 79 228 / 43%), rgb(43 54 110 / 64%)); box-shadow: 0 0 0 3px rgb(142 103 244 / 14%), inset 0 1px rgb(255 255 255 / 10%); }
.emotion-picker-tile__icon { flex: none; font-size: 24px; color: #a990ff; }
.emotion-picker-tile__label { max-width: 100%; overflow-wrap: anywhere; text-align: center; font-size: 11px; font-weight: 750; line-height: 1.1; text-wrap: balance; }
.emotion-level { width: 100%; min-width: 0; border: 1px solid rgb(184 200 238 / 13%); border-radius: 12px; padding: 10px 4px; color: #c5d1ea; background: rgb(255 255 255 / 4%); overflow-wrap: anywhere; }
.emotion-level.is-selected { border-color: #9477ec; color: white; background: rgb(125 88 232 / 28%); }
</style>
