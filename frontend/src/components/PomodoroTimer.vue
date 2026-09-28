<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['focus-complete']);
const { t } = useI18n();

const focusSeconds = 25 * 60;
const breakSeconds = 5 * 60;
const phase = ref('focus');
const secondsLeft = ref(focusSeconds);
const isRunning = ref(false);
let intervalId;
let endsAt = null;

const displayTime = computed(() => {
  const minutes = Math.floor(secondsLeft.value / 60);
  const seconds = secondsLeft.value % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

function clearTicker() {
  if (intervalId) {
    window.clearInterval(intervalId);
    intervalId = undefined;
  }
}

function finishPhase() {
  const finishedPhase = phase.value;
  isRunning.value = false;
  clearTicker();

  if (finishedPhase === 'focus') {
    emit('focus-complete');
    phase.value = 'break';
    secondsLeft.value = breakSeconds;
  } else {
    phase.value = 'focus';
    secondsLeft.value = focusSeconds;
  }
}

function tick() {
  secondsLeft.value = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));

  if (secondsLeft.value === 0) {
    finishPhase();
  }
}

function start() {
  if (isRunning.value) return;

  isRunning.value = true;
  endsAt = Date.now() + secondsLeft.value * 1000;
  tick();
  intervalId = window.setInterval(tick, 500);
}

function pause() {
  if (!isRunning.value) return;

  tick();
  isRunning.value = false;
  clearTicker();
}

function reset() {
  pause();
  phase.value = 'focus';
  secondsLeft.value = focusSeconds;
}

onBeforeUnmount(clearTicker);
</script>

<template>
  <section class="paper-card p-5 text-center">
    <p class="text-xs font-extrabold uppercase tracking-[0.15em] text-[#6552af]">
      <span class="material-symbols-outlined mr-1 align-middle text-base" aria-hidden="true">hourglass_top</span>
      {{ t('timer.title') }} · {{ phase === 'focus' ? t('timer.work') : t('timer.break') }}
    </p>
    <p class="mt-2 text-[46px] font-extrabold tracking-tight text-[#1b2847] tabular-nums" role="timer">{{ displayTime }}</p>

    <div class="mt-4 flex justify-center gap-2">
      <button type="button" class="quest-action min-w-32 px-5 py-2.5 text-sm" @click="isRunning ? pause() : start()">
        {{ isRunning ? t('timer.pause') : secondsLeft === (phase === 'focus' ? focusSeconds : breakSeconds) ? t('timer.start') : t('timer.resume') }}
      </button>
      <button type="button" class="rounded-xl border border-[#dce1ef] bg-[#f4f5fb] px-4 py-2.5 text-sm font-semibold text-[#53617c]" @click="reset">
        {{ t('timer.reset') }}
      </button>
    </div>
  </section>
</template>
