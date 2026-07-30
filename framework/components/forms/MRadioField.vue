<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import MFieldLabel from "./MFieldLabel.vue"
import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"

type Option = { label: string; value: string }

defineProps<{
  modelValue?: string | null
  label?: string
  options: Option[]
  hint?: string | null
  error?: string | null
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
    <RadioGroup
      :model-value="modelValue ?? ''"
      :disabled="disabled"
      class="flex flex-wrap gap-4"
      @update:model-value="(v) => $emit('update:modelValue', String(v))"
    >
      <label v-for="item in options" :key="item.value" class="flex items-center gap-2 text-sm">
        <RadioGroupItem :value="item.value" />
        {{ item.label }}
      </label>
    </RadioGroup>
    <MFieldHint :text="hint" />
    <MFieldError :error="error" />
  </div>
</template>