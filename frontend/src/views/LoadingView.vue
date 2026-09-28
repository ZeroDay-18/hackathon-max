<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-[#070913] transition-colors duration-300">
    <div class="relative flex items-center justify-center">
      
      <span class="material-symbols-outlined animate-spin text-5xl text-purple-600 dark:text-purple-500 select-none relative z-10">
        progress_activity
      </span>
      
      <div class="absolute inset-0 rounded-full shadow-[0_0_25px_rgba(124,58,237,0.5)] dark:block hidden pointer-events-none"></div>

    </div>
    <p class="text-violet-600 dark:text-violet-300 text-xs mt-4">Загружаем приложение...</p>
  </div>
</template>

<script setup>
</script>