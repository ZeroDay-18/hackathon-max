<script setup>
import { onMounted, ref } from 'vue';

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const textr = ref("Загрузка...");
const initDataLog = ref("");

onMounted(async () => {
  try {
    const initData = window.WebApp?.initData || "123";
    initDataLog.value = initData;

    const response = await fetch(`${VITE_BACKEND_URL}/api/auth/max-miniapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initData }),
    });

    // Read response text first to avoid JSON parse crashes if the server returns HTML/empty text
    const responseText = await response.text();

    if (!response.ok) {
      textr.value = `Ошибка сервера: ${response.status} ${response.statusText}\n${responseText}`;
      return;
    }

    // Safely parse JSON if response is not empty
    try {
      const data = responseText ? JSON.parse(responseText) : {};
      textr.value = JSON.stringify(data, null, 2);
    } catch {
      textr.value = responseText; // Fallback if it's plain text
    }

  } catch (err) {
    textr.value = `Ошибка клиента: ${err.message}`;
  }
});
</script>

<template>
    <div class="bg-neutral-900 w-full h-dvh text-emerald-200 p-4">
        <h1 class="text-emerald-500 text-xl font-bold">You did it!</h1>
        <p>
            Visit <a href="https://vuejs.org/" target="_blank" rel="noopener" class="underline">vuejs.org</a> to read the documentation.
        </p>
        <div class="w-full p-4">
            <h3>MAX INFO:</h3>
            <textarea :value="textr" readonly class="w-full h-40 rounded-2xl bg-neutral-950 p-4 text-emerald-300 font-mono"></textarea>
        </div>
        <div class="p-4">
            <p>initData: {{ initDataLog }}</p>
        </div>
    </div>
</template>