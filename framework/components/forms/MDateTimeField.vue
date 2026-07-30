<script setup lang="ts">
import { Input } from "@/components/ui/input"
import MFieldLabel from "./MFieldLabel.vue"
import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"

defineProps<{
  modelValue?: string | null
  label?: string
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
  <div class="grid gap-2">
    <MFieldLabel :label="label" :required="required" />
    <Input
      type="datetime-local"
      :model-value="modelValue ?? ''"
      :disabled="disabled"
      @update:model-value="(v) => $emit('update:modelValue', String(v ?? ''))"
    />
    <MFieldHint :text="hint" />
    <MFieldError :error="error" />
  </div>
</template>