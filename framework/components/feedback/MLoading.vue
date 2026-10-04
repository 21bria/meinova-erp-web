<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="rounded-lg border py-16 text-center text-sm text-muted-foreground">
    {{ text ?? $t('common.state.loading') }}
  </div>
</template>