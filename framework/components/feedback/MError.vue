<script setup lang="ts">
defineProps<{
  title?: string
  message?: string
}>()
</script>

<template>
  <div class="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
    <div class="text-sm font-medium text-destructive">
      {{ title ?? "Something went wrong" }}
    </div>

    <p class="mt-1 text-sm text-muted-foreground">
      {{ message ?? "Please try again or contact administrator." }}
    </p>
  </div>
</template>