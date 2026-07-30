<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(), {
  placeholder: 'Search master data',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function updateValue(value: string | number) {
  emit('update:modelValue', String(value))
}
</script>

<template>
  <div class="relative w-full">
    <!-- <Icon
      name="i-lucide-search"
      class="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground"
    /> -->

    <Input
      :model-value="modelValue"
      :placeholder="placeholder"
      class="h-10 w-full pl-10 pr-9"
      @update:model-value="updateValue"
    />

    <button
      v-if="modelValue"
      type="button"
      aria-label="Clear search"
      class="absolute right-3 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground"
      @click="emit('update:modelValue', '')"
    >
      <Icon
        name="i-lucide-x"
        class="size-4"
      />
    </button>
  </div>
</template>