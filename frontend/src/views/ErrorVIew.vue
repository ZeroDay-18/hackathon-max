<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50 dark:bg-[#070913] transition-colors duration-300 text-center">
    
    <!-- Большая иконка -->
    <div class="mb-6 text-[#202a5c]">
      <span class="material-symbols-outlined select-none" style="font-size: 80px; font-variation-settings: 'OPSZ' 80;">
        error
      </span>
    </div>

    <!-- Заголовок -->
    <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3 max-w-sm">
      {{ title }}
    </h2>

    <!-- Описание -->
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-sm">
      {{ message }}
    </p>

  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Что-то пошло не так'
  },
  message: {
    type: String,
    default: 'Не удалось загрузить данные квеста. Проверьте подключение к сети и повторите попытку.'
  },
});

defineEmits(['retry']);
</script>