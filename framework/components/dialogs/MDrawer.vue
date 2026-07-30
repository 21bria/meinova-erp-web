<script setup lang="ts">
defineProps<{
  open: boolean
  title?: string
}>()

const emit = defineEmits<{
  (e: "update:open", value: boolean): void
}>()
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
    @click.self="emit('update:open', false)"
  >
    <aside class="ml-auto h-full w-full max-w-xl border-l bg-background p-6 shadow-lg">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-lg font-medium">
          {{ title }}
        </h2>

        <button
          class="text-sm text-muted-foreground hover:text-foreground"
          @click="emit('update:open', false)"
        >
          Close
        </button>
      </div>

      <slot />
    </aside>
  </div>
</template>