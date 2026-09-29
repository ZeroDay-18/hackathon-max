<script setup>
import { computed } from 'vue';
import { Avatar, Style } from '@dicebear/core';
import pixelArt from '@dicebear/styles/pixel-art.json';

const props = defineProps({
  name: { type: String, default: '' },
  seed: { type: String, default: '' },
});

const source = computed(() => {
  const stableSeed = props.seed || props.name || 'studyquest-user';
  const style = new Style(pixelArt);
  const avatar = new Avatar(style, {
    seed: stableSeed,
    backgroundColor: 'b6e3f4',
    borderRadius: 18,
    size: 160,
  });

  return avatar.toDataUri();
});
</script>

<template>
  <span class="inline-grid shrink-0 place-items-center overflow-hidden rounded-[14px] border-2 border-[#ae9ff8] bg-[#291e60] shadow-[0_3px_0_#412d8e,0_5px_12px_#120d33]">
    <img :src="source" :alt="name || 'Аватар пользователя'" class="h-full w-full object-cover" decoding="async">
  </span>
</template>
