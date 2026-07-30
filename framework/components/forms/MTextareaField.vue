<script setup lang="ts">
import { Textarea } from "@/components/ui/textarea"
import MFieldLabel from "./MFieldLabel.vue"
import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"

defineProps<{
  modelValue?: string | null
  label?: string
  placeholder?: string
  rows?: number
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
  <div class="grid w-full gap-2">
    <MFieldLabel :label="label" :required="required" />
    <Textarea
      :model-value="modelValue ?? ''"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      class="w-full"
      @update:model-value="(v) => emit('update:modelValue', String(v ?? ''))"
    />
    <MFieldHint :text="hint" />
    <MFieldError :error="error" />
  </div>
</template>