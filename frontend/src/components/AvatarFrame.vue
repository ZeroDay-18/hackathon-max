<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  name: { type: String, default: '' },
  photoUrl: { type: String, default: null },
});

const imageFailed = ref(false);
watch(() => props.photoUrl, () => { imageFailed.value = false; });
</script>

<template>
  <span class="inline-grid shrink-0 place-items-center overflow-hidden rounded-[14px] border-2 border-[#ae9ff8] bg-[#291e60] font-black text-[#e7dcff] shadow-[0_3px_0_#412d8e,0_5px_12px_#120d33]">
    <img
      v-if="photoUrl && !imageFailed"
      :src="photoUrl"
      :alt="name"
      class="h-full w-full object-cover"
      @error="imageFailed = true"
    >
    <span v-else aria-hidden="true">{{ name.slice(0, 1).toLocaleUpperCase('ru') || '?' }}</span>
  </span>
</template>
