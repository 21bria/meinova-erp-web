<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="rounded-lg border border-dashed py-16 text-center">
    <div class="text-sm font-medium">
      {{ title ?? $t('common.state.noData') }}
    </div>

    <p class="mt-1 text-sm text-muted-foreground">
      {{ description ?? $t('common.state.adjustFilters') }}
    </p>
  </div>
</template>