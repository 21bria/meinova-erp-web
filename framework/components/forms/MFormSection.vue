<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <section class="rounded-lg border p-5">
    <div v-if="title || description" class="mb-5">
      <h3 v-if="title" class="font-medium">
        {{ title }}
      </h3>

      <p v-if="description" class="mt-1 text-sm text-muted-foreground">
        {{ description }}
      </p>
    </div>

    <slot />
  </section>
</template>