<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="rounded-lg border border-dashed py-20 text-center">
    <h2 class="text-lg font-medium">
      {{ title ?? "Page not found" }}
    </h2>

    <p class="mt-2 text-sm text-muted-foreground">
      {{ description ?? "The page you are looking for does not exist." }}
    </p>
  </div>
</template>