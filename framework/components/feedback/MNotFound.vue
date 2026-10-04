<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="rounded-lg border border-dashed py-20 text-center">
    <h2 class="text-lg font-medium">
      {{ title ?? $t('common.state.notFoundTitle') }}
    </h2>

    <p class="mt-2 text-sm text-muted-foreground">
      {{ description ?? $t('common.state.notFoundBody') }}
    </p>
  </div>
</template>