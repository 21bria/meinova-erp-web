<script setup lang="ts">
import MFileField from "./MFileField.vue"

defineProps<{
  label?: string
  hint?: string | null
  error?: string | null
  required?: boolean
  disabled?: boolean
}>()

defineEmits<{
  (e: "update:modelValue", value: File | null): void
}>()
</script>

<template>
  <MFileField
    :label="label"
    :hint="hint"
    :error="error"
    :required="required"
    :disabled="disabled"
    accept="image/*"
    @update:model-value="(v) => $emit('update:modelValue', v)"
  />
</template>