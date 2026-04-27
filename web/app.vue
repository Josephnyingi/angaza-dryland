<script setup lang="ts">
const error = ref<string | null>(null)
onErrorCaptured((err) => {
  error.value = String(err)
  return false
})
</script>

<template>
  <div>
    <div v-if="error" style="padding:2rem;background:#fee2e2;color:#991b1b;font-family:monospace;white-space:pre-wrap;font-size:13px;position:fixed;top:0;left:0;right:0;z-index:9999;max-height:50vh;overflow:auto">
      <strong>App Error:</strong><br>{{ error }}
    </div>
    <NuxtLoadingIndicator color="#2D6A4F" :height="3" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
