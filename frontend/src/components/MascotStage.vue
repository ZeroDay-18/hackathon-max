<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  stage: { type: Number, default: 0 },
  max: { type: Number, default: 4 },
  size: { type: String, default: '200px' },
})

const MAX_STAGE = computed(() => props.max)

/** Плавный рост: чем выше стадия, тем крупнее существо */
const scale = computed(() => 0.52 + (props.stage / MAX_STAGE.value) * 0.62)

const stageLabel = computed(() => `${props.stage} / ${MAX_STAGE.value}`)

const pulse = ref(false)

watch(
  () => props.stage,
  () => {
    pulse.value = true
    window.setTimeout(() => (pulse.value = false), 900)
  },
)

/* Декорации появляются на своих стадиях */
const hasSprout = computed(() => props.stage >= 1)
const hasEars = computed(() => props.stage >= 2)
const hasScarf = computed(() => props.stage >= 3)
const hasCrown = computed(() => props.stage >= MAX_STAGE.value)
</script>

<template>
  <div class="mascot relative grid place-items-center" :style="{ width: size, height: size }">
    <!-- свечение вокруг существа -->
    <div
      class="pointer-events-none absolute inset-[12%] rounded-full transition-opacity duration-700"
      :class="pulse ? 'bg-accent/25 opacity-100' : 'bg-accent/10 opacity-70'"
      style="filter: blur(18px)"
    />

    <!-- волна при повышении стадии -->
    <div
      v-if="pulse"
      class="pointer-events-none absolute inset-[18%] rounded-full border border-accent/50 animate-ping"
    />

    <svg viewBox="0 0 200 200" class="relative h-full w-full overflow-visible">
      <!-- тень -->
      <ellipse
        cx="100"
        cy="168"
        rx="46"
        ry="9"
        fill="currentColor"
        opacity="0.12"
        class="text-ink"
      />

      <g
        class="origin-center transition-transform duration-700 ease-[cubic-bezier(.34,1.56,.64,1)]"
        :style="{ transform: `scale(${scale})` }"
      >
        <!-- ростки / листья -->
        <g
          v-if="hasSprout"
          class="origin-bottom transition-opacity duration-500"
          style="transform-origin: 100px 66px"
        >
          <path
            d="M100 66 C 100 44, 88 34, 72 30 C 74 48, 84 60, 100 66 Z"
            fill="var(--color-accent-strong)"
            opacity="0.9"
          />
          <path
            d="M100 66 C 100 46, 110 36, 126 32 C 124 50, 114 62, 100 66 Z"
            fill="var(--color-accent)"
            opacity="0.75"
          />
        </g>

        <!-- ушки на 2-й стадии и дальше -->
        <g v-if="hasEars" class="transition-opacity duration-500">
          <path
            d="M56 74 C 46 58, 48 46, 58 44 C 68 46, 70 62, 66 76 Z"
            fill="var(--color-accent-strong)"
            opacity="0.85"
          />
          <path
            d="M144 74 C 154 58, 152 46, 142 44 C 132 46, 130 62, 134 76 Z"
            fill="var(--color-accent-strong)"
            opacity="0.85"
          />
        </g>

        <!-- тело -->
        <ellipse cx="100" cy="112" rx="60" ry="56" fill="url(#bodyGradient)" />
        <ellipse cx="100" cy="126" rx="40" ry="30" fill="#fff" opacity="0.14" />

        <!-- шарф -->
        <g v-if="hasScarf" class="transition-opacity duration-500">
          <path
            d="M58 96 C 76 108, 124 108, 142 96 L 138 108 C 122 120, 78 120, 62 108 Z"
            fill="var(--color-warn)"
            opacity="0.9"
          />
        </g>

        <!-- корона на максимальной стадии -->
        <g v-if="hasCrown" class="transition-opacity duration-500">
          <path
            d="M78 52 L 84 32 L 100 46 L 116 32 L 122 52 Z"
            fill="var(--color-warn)"
            stroke="var(--color-warn)"
            stroke-width="6"
            stroke-linejoin="round"
          />
        </g>

        <!-- щёчки -->
        <ellipse cx="70" cy="122" rx="9" ry="6" fill="var(--color-danger)" opacity="0.35" />
        <ellipse cx="130" cy="122" rx="9" ry="6" fill="var(--color-danger)" opacity="0.35" />

        <!-- глаза -->
        <g class="mascot__eyes">
          <ellipse cx="84" cy="106" rx="6.5" ry="8" fill="#0b0f13" />
          <ellipse cx="116" cy="106" rx="6.5" ry="8" fill="#0b0f13" />
          <circle cx="86" cy="103" r="2.2" fill="#fff" />
          <circle cx="118" cy="103" r="2.2" fill="#fff" />
        </g>

        <!-- рот -->
        <path
          d="M92 124 Q 100 132 108 124"
          stroke="#0b0f13"
          stroke-width="3.5"
          stroke-linecap="round"
          fill="none"
        />
      </g>

      <defs>
        <radialGradient id="bodyGradient" cx="35%" cy="28%" r="78%">
          <stop offset="0%" stop-color="var(--color-accent)" />
          <stop offset="100%" stop-color="var(--color-accent-strong)" />
        </radialGradient>
      </defs>
    </svg>

    <!-- бейдж стадии -->
    <span
      class="absolute -bottom-1 rounded-full border border-line bg-surface-raised/80 px-2.5 py-0.5 text-[11px] font-semibold text-ink-muted backdrop-blur"
    >
      {{ stageLabel }}
    </span>
  </div>
</template>

<style scoped>
.mascot {
  animation: mascot-float 4.5s ease-in-out infinite;
}

.mascot__eyes {
  animation: mascot-blink 5.5s ease-in-out infinite;
  transform-origin: 100px 108px;
}

@keyframes mascot-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-7px);
  }
}

@keyframes mascot-blink {
  0%,
  92%,
  100% {
    transform: scaleY(1);
  }
  96% {
    transform: scaleY(0.08);
  }
}
</style>
