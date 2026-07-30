<script setup lang="ts">
defineProps<{
  items?: any[]
  title?: string
}>()
</script>

<template>
  <div class="rounded-lg border p-4">
    <div v-if="title" class="mb-3 font-medium">
      {{ title }}
    </div>

    <div v-if="!items?.length" class="text-sm text-muted-foreground">
      No tree data.
    </div>

    <pre v-else class="text-xs">{{ items }}</pre>
  </div>
</template>