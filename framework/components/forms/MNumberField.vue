<script setup lang="ts">
import { Input } from "@/components/ui/input"
import MFieldLabel from "./MFieldLabel.vue"
import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"

defineProps<{
  modelValue?: number | null
  label?: string
  placeholder?: string
  error?: string | null
  hint?: string | null
  required?: boolean
  disabled?: boolean
  min?: number
  max?: number
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void
}>()
</script>

<template>
  <div class="grid gap-2">
    <MFieldLabel :label="label" :required="required" />
    <Input
      type="number"
      :model-value="modelValue ?? ''"
      :placeholder="placeholder"
      :disabled="disabled"
      :min="min"
      :max="max"
      @update:model-value="(v) => emit('update:modelValue', v === '' ? null : Number(v))"
    />
    <MFieldHint :text="hint" />
    <MFieldError :error="error" />
  </div>
</template>