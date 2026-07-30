<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"
import MFieldLabel from "./MFieldLabel.vue"

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

withDefaults(
  defineProps<{
    modelValue?: string | number | null
    label?: string
    placeholder?: string
    options?: SelectOption[]
    error?: string | null
    hint?: string | null
    required?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: null,
    placeholder: "Select option",
    options: () => [],
    error: null,
    hint: null,
    required: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [
    value: string | number | null,
  ]
}>()

function handleValueChange(
  value:
    | string
    | number
    | bigint
    | Record<string, any>
    | null,
) {
  if (
    typeof value === "string"
    || typeof value === "number"
    || value === null
  ) {
    emit("update:modelValue", value)
  }
}
</script>

<template>
  <div class="grid gap-2">
    <MFieldLabel
      :label="label"
      :required="required"
    />

    <Select
      :model-value="modelValue"
      :disabled="disabled"
      @update:model-value="handleValueChange"
    >
      <SelectTrigger class="w-full">
        <SelectValue :placeholder="placeholder" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem
          v-for="item in options"
          :key="String(item.value)"
          :value="item.value"
          :disabled="item.disabled"
        >
          {{ item.label }}
        </SelectItem>
      </SelectContent>
    </Select>

    <MFieldHint :text="hint" />
    <MFieldError :error="error" />
  </div>
</template>