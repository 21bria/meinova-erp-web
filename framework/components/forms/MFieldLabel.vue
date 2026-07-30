<script setup lang="ts">
defineProps<{
  label?: string
  required?: boolean
}>()
</script>

<template>
  <label v-if="label" class="text-sm font-medium">
    {{ label }}
    <span v-if="required" class="text-destructive">*</span>
  </label>
</template>