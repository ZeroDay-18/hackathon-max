<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
  level: { type: Number, default: 1 },
});

const stage = computed(() => Math.min(5, Math.max(1, Number.isFinite(props.level) ? Math.floor(props.level) : 1)));
const stageLabel = computed(() => t(`profile.mascotStages.${stage.value}`));
</script>

<template>
  <section class="axolotl-stage" :class="`axolotl-stage--${stage}`" :aria-label="`Аксалотль: стадия «${stageLabel}», уровень ${Math.max(1, level || 1)}`">
    <div class="axolotl-stage__stars" aria-hidden="true"><i v-for="item in stage + 1" :key="item" /></div>
    <img class="axolotl-stage__image" src="/mascot/pink-pixel-axolotl.jpg" alt="" aria-hidden="true">
    <div class="axolotl-stage__caption"><span class="material-symbols-outlined" aria-hidden="true">pets</span><span>{{ stageLabel }}</span><span class="text-[#c9b8ff]">· стадия {{ stage }}/5</span></div>
  </section>
</template>

<style scoped>
.axolotl-stage { position: relative; display: grid; min-height: 252px; place-items: center; overflow: hidden; border: 1px solid rgb(243 179 223 / 25%); border-radius: 22px; background: radial-gradient(circle at 50% 42%, rgb(245 110 181 / 18%), transparent 38%), linear-gradient(150deg, rgb(48 35 75 / 96%), rgb(20 29 53 / 95%)); box-shadow: inset 0 1px rgb(255 255 255 / 8%), 0 12px 28px rgb(0 0 0 / 24%); }
.axolotl-stage::before, .axolotl-stage::after { position: absolute; border-radius: 50%; content: ''; filter: blur(2px); }
.axolotl-stage::before { width: 176px; height: 176px; background: rgb(255 159 207 / 13%); }
.axolotl-stage::after { width: 250px; height: 90px; bottom: -53px; background: rgb(125 91 238 / 30%); filter: blur(25px); }
.axolotl-stage__image { position: relative; z-index: 1; width: 170px; max-width: 76%; height: 170px; object-fit: contain; transform: translateY(9px) scale(.72); transform-origin: center bottom; image-rendering: pixelated; mix-blend-mode: screen; filter: drop-shadow(0 11px 11px rgb(10 4 21 / 62%)); transition: transform 300ms ease, filter 300ms ease; }
.axolotl-stage__caption { position: absolute; z-index: 2; bottom: 13px; display: flex; align-items: center; gap: 5px; border: 1px solid rgb(255 255 255 / 13%); border-radius: 999px; padding: 7px 11px; color: #f3edff; background: rgb(11 16 37 / 64%); font-size: 11px; font-weight: 800; backdrop-filter: blur(8px); }
.axolotl-stage__caption .material-symbols-outlined { font-size: 15px; color: #ffb6dc; }.axolotl-stage__stars { position: absolute; z-index: 0; inset: 0; pointer-events: none; }.axolotl-stage__stars i { position: absolute; width: 4px; height: 4px; border-radius: 99px; background: #ffd6ea; box-shadow: 0 0 10px #ffb8d9; }.axolotl-stage__stars i:nth-child(1) { top: 23%; left: 19%; }.axolotl-stage__stars i:nth-child(2) { top: 30%; right: 21%; }.axolotl-stage__stars i:nth-child(3) { top: 13%; left: 49%; }.axolotl-stage__stars i:nth-child(4) { top: 50%; left: 11%; }.axolotl-stage__stars i:nth-child(5) { top: 50%; right: 12%; }.axolotl-stage__stars i:nth-child(6) { top: 17%; right: 38%; }
.axolotl-stage--2 .axolotl-stage__image { transform: translateY(8px) scale(.81); }.axolotl-stage--3 .axolotl-stage__image { transform: translateY(7px) scale(.9); filter: drop-shadow(0 11px 13px rgb(255 103 184 / 32%)) drop-shadow(0 11px 11px rgb(10 4 21 / 62%)); }.axolotl-stage--4 .axolotl-stage__image { transform: translateY(6px) scale(.99); filter: saturate(1.13) drop-shadow(0 0 18px rgb(240 117 218 / 36%)) drop-shadow(0 11px 11px rgb(10 4 21 / 62%)); }.axolotl-stage--5 .axolotl-stage__image { transform: translateY(5px) scale(1.08); filter: saturate(1.22) drop-shadow(0 0 23px rgb(255 156 217 / 53%)) drop-shadow(0 11px 11px rgb(10 4 21 / 62%)); }.axolotl-stage--5::before { background: rgb(255 142 206 / 24%); }
@media (prefers-reduced-motion: reduce) { .axolotl-stage__image { transition: none; } }
</style>
