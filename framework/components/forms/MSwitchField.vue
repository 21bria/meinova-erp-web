<script setup lang="ts">
import { Switch } from "@/components/ui/switch"
import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"

defineProps<{
  modelValue?: boolean
  label?: string
  hint?: string | null
  error?: string | null
  disabled?: boolean
}>()

defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()
</script>

<template>
  <div class="space-y-2">
    <label class="flex items-center gap-3 text-sm">
      <Switch
        :model-value="modelValue"
        :disabled="disabled"
        @update:model-value="(v) => $emit('update:modelValue', v)"
      />
      {{ label }}
    </label>
    <MFieldHint :text="hint" />
    <MFieldError :error="error" />
  </div>
</template>