<script setup lang="ts">
import { Input } from "@/components/ui/input"
import MFieldLabel from "./MFieldLabel.vue"
import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"

defineProps<{
  label?: string
  hint?: string | null
  error?: string | null
  required?: boolean
  disabled?: boolean
  accept?: string
}>()

defineEmits<{
  (e: "update:modelValue", value: File | null): void
}>()
</script>

<template>
  <div class="grid gap-2">
    <MFieldLabel :label="label" :required="required" />
    <Input
      type="file"
      :accept="accept"
      :disabled="disabled"
      @change="$emit('update:modelValue', (($event.target as HTMLInputElement).files?.[0] ?? null))"
    />
    <MFieldHint :text="hint" />
    <MFieldError :error="error" />
  </div>
</template>