<script setup lang="ts">
import type { MasterHubCategory } from '../types'

withDefaults(defineProps<{
  categories: MasterHubCategory[]
  modelValue: string
  allLabel?: string
}>(), {
  allLabel: 'All Masters',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex w-max min-w-full items-center gap-1 lg:min-w-0">
    <Button
      type="button"
      size="sm"
      variant="ghost"
      class="shrink-0 rounded-full px-4"
      :class="modelValue === 'all'
        ? 'bg-muted text-foreground hover:bg-muted'
        : 'text-muted-foreground'"
      @click="emit('update:modelValue', 'all')"
    >
      {{ allLabel }}
    </Button>

    <Button
      v-for="category in categories"
      :key="category.key"
      type="button"
      size="sm"
      variant="ghost"
      class="shrink-0 gap-2 rounded-full px-4"
      :class="modelValue === category.key
        ? 'bg-muted text-foreground hover:bg-muted'
        : 'text-muted-foreground'"
      @click="emit('update:modelValue', category.key)"
       >
      <Icon
        v-if="category.icon"
        :name="category.icon"
        class="size-4"
      />

      {{ category.label }}
    </Button>
  </div>
</template>