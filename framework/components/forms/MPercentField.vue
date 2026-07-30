<script setup lang="ts">
import { Input } from "@/components/ui/input"
import MFieldLabel from "./MFieldLabel.vue"
import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"

defineProps<{
  modelValue?: number | null
  label?: string
  error?: string | null
  hint?: string | null
  required?: boolean
  disabled?: boolean
}>()

defineEmits<{
  (e: "update:modelValue", value: number | null): void
}>()
</script>

<template>
  <div class="grid gap-2">
    <MFieldLabel :label="label" :required="required" />
    <div class="flex items-center gap-2">
      <Input
        type="number"
        :model-value="modelValue ?? ''"
        :disabled="disabled"
        @update:model-value="(v) => $emit('update:modelValue', v === '' ? null : Number(v))"
      />
      <span class="text-sm text-muted-foreground">%</span>
    </div>
    <MFieldHint :text="hint" />
    <MFieldError :error="error" />
  </div>
</template>