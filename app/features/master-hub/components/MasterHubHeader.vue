<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
}>(), {
  description: '',
})
</script>

<template>
  <div class="min-w-0">
    <h1 class="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
      {{ title }}
    </h1>

    <p
      v-if="description"
      class="mt-1 text-sm text-muted-foreground"
    >
      {{ description }}
    </p>
  </div>
</template>