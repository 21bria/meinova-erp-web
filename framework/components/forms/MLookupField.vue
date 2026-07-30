<script setup lang="ts">
import MLookupSelect from "../lookup/MLookupSelect.vue"

import MFieldLabel from "./MFieldLabel.vue"
import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"

defineProps({
  modelValue: null,
  label: String,
  endpoint: {
    type: String,
    required: true,
  },
  placeholder: String,
  error: String,
  hint: String,
  required: Boolean,
  disabled: Boolean,
  labelKey: String,
  valueKey: String,
  selectedLabel: String,

  depends: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <div class="grid gap-2">
    <MFieldLabel
      :label="label"
      :required="required"
    />

    <MLookupSelect
      :model-value="modelValue"
      :label="label ?? ''"
      :endpoint="endpoint"
      :depends="depends"
      :label-key="labelKey"
      :value-key="valueKey"
      :selected-label="selectedLabel"
      :placeholder="placeholder"
      :disabled="disabled"
      variant="field"
      @update:model-value="$emit('update:modelValue', $event)"
    />

    <MFieldHint :text="hint" />
    <MFieldError :error="error" />
  </div>
</template>