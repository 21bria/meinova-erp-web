<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="rounded-lg border border-dashed py-16 text-center">
    <div class="text-sm font-medium">
      {{ title ?? "No data found" }}
    </div>

    <p class="mt-1 text-sm text-muted-foreground">
      {{ description ?? "Try adjusting your search or filters." }}
    </p>
  </div>
</template>