<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="flex h-[320px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
    {{ message ?? "No chart data available." }}
  </div>
</template>