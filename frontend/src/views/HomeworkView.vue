<script setup>
import { onMounted, ref } from 'vue';

const textr = ref("Загрузка...")

onMounted(async () => {
  try {
    const initData = window.WebApp.initData || "123"

    const response = await fetch('http://localhost:3000/api/auth/max-miniapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        initData,
      }),
    })

    if (!response.ok) {
        textr.value = `Ошибка сервера: ${response.status} ${response.statusText}`;
    }

    textr.value = await response.json()
  } catch (err) {
    textr.value = err;
  }
})
</script>

<template>
    <div class="bg-neutral-900 w-full h-dvh text-emerald-200">
        <h1 class="text-emerald-500">You did it!</h1>
        <p>
            Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
            documentation
        </p>
        <div class="w-full p-4">
            <h3>MAX INFO:</h3>
            <textarea class="w-full rounded-2xl bg-neutral-950 p-4">{{ textr }}</textarea>
        </div>
    </div>
</template>