<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
  canReset?: boolean
}>(), {
  title: 'No master data found',
  description: 'Try another keyword or select a different category.',
  canReset: false,
})

const emit = defineEmits<{
  reset: []
}>()
</script>

<template>
  <div
    class="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center mt-6 mb-6"
  >
    <div class="flex size-14 items-center justify-center rounded-full bg-muted">
      <Icon
        name="i-lucide-database-zap"
        class="size-6 text-muted-foreground"
      />
    </div>

    <h2 class="mt-4 font-medium text-foreground">
      {{ title }}
    </h2>

    <p class="mt-1 max-w-md text-sm text-muted-foreground">
      {{ description }}
    </p>

    <Button
      v-if="canReset"
      type="button"
      variant="outline"
      size="sm"
      class="mt-5"
      @click="emit('reset')"
    >
      <Icon
        name="i-lucide-rotate-ccw"
        class="mr-2 size-4"
      />

      Reset filters
    </Button>
  </div>
</template>