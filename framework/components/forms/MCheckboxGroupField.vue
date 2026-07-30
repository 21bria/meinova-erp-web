<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox"
import MFieldLabel from "./MFieldLabel.vue"
import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"

type Option = { label: string; value: string | number }

const props = defineProps<{
  modelValue?: Array<string | number>
  label?: string
  options: Option[]
  hint?: string | null
  error?: string | null
  required?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: Array<string | number>): void
}>()

function toggle(value: string | number, checked: boolean) {
  const current = props.modelValue ?? []
  emit(
    "update:modelValue",
    checked ? [...current, value] : current.filter((v) => v !== value),
  )
}
</script>

<template>
  <div class="grid gap-2">
    <MFieldLabel :label="label" :required="required" />
    <div class="grid gap-2 rounded-md border p-3">
      <label v-for="item in options" :key="item.value" class="flex items-center gap-2 text-sm">
        <Checkbox
          :model-value="(modelValue ?? []).includes(item.value)"
          :disabled="disabled"
          @update:model-value="(v) => toggle(item.value, v === true)"
        />
        {{ item.label }}
      </label>
    </div>
    <MFieldHint :text="hint" />
    <MFieldError :error="error" />
  </div>
</template>