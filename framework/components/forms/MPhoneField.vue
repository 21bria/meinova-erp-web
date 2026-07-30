<script setup lang="ts">
import MInputField from "./MInputField.vue"

defineProps<{
  modelValue?: string | null
  label?: string
  placeholder?: string
  error?: string | null
  hint?: string | null
  required?: boolean
  disabled?: boolean
}>()

defineEmits<{
  (e: "update:modelValue", value: string): void
}>()
</script>

<template>
  <MInputField
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder ?? '+62...'"
    :error="error"
    :hint="hint"
    :required="required"
    :disabled="disabled"
    @update:model-value="(v) => $emit('update:modelValue', v)"
  />
</template>