<script setup lang="ts">
import { Input } from "@/components/ui/input"
import MFieldLabel from "./MFieldLabel.vue"
import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"

defineProps<{
  modelValue?: string | null
  label?: string
  placeholder?: string
  error?: string | null
  hint?: string | null
  required?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()
</script>

<template>
  <div class="grid gap-2">
    <MFieldLabel :label="label" :required="required" />
    <Input
      type="password"
      :model-value="modelValue ?? ''"
      :placeholder="placeholder"
      :disabled="disabled"
      @update:model-value="(v) => emit('update:modelValue', String(v ?? ''))"
    />
    <MFieldHint :text="hint" />
    <MFieldError :error="error" />
  </div>
</template>