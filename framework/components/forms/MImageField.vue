<script setup lang="ts">
import MFileField from "./MFileField.vue"

const props = withDefaults(
  defineProps<{
    modelValue?:
      | File
      | File[]
      | string
      | null

    label?: string
    hint?: string | null
    error?: string | null

    required?: boolean
    disabled?: boolean

    multiple?: boolean
    maxSizeMb?: number
  }>(),
  {
    modelValue: null,
    label: "",
    hint: null,
    error: null,
    required: false,
    disabled: false,
    multiple: false,
    maxSizeMb: undefined,
  },
)

const emit = defineEmits<{
  "update:modelValue": [
    value: File | File[] | null,
  ]

  error: [
    message: string,
  ]
}>()
</script>

<template>
  <MFileField
    :model-value="props.modelValue"
    :label="props.label"
    :hint="props.hint"
    :error="props.error"
    :required="props.required"
    :disabled="props.disabled"
    :multiple="props.multiple"
    :max-size-mb="props.maxSizeMb"
    accept="image/*"
    @update:model-value="
      emit(
        'update:modelValue',
        $event,
      )
    "
    @error="
      emit(
        'error',
        $event,
      )
    "
  />
</template>