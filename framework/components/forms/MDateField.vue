<script setup lang="ts">
import { Input } from "@/components/ui/input"
import MFieldLabel from "./MFieldLabel.vue"
import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"
import { normalizeDateInput } from "@framework/core/utils/date"

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

function update(v: any) {
  emit("update:modelValue", normalizeDateInput(String(v ?? "")))
}
</script>

<template>
  <div class="grid gap-2">
    <MFieldLabel :label="label" :required="required" />
    <Input
      :model-value="modelValue ?? ''"
      :placeholder="placeholder ?? 'dd.mm.yy / yyyy-mm-dd'"
      :disabled="disabled"
      @change="update(($event.target as HTMLInputElement).value)"
    />
    <MFieldHint :text="hint ?? 'Example: 01.02.26 becomes 2026-02-01'" />
    <MFieldError :error="error" />
  </div>
</template>