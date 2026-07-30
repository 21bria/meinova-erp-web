<script setup lang="ts">
defineEmits<{
  (e: "submit"): void
}>()
</script>

<template>
  <form class="space-y-6" @submit.prevent="$emit('submit')">
    <slot />
  </form>
</template>