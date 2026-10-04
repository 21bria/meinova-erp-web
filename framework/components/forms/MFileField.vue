<script setup lang="ts">
import {
  computed,
  ref,
} from "vue"

import { Input } from "@/components/ui/input"

import MFieldError from "./MFieldError.vue"
import MFieldHint from "./MFieldHint.vue"
import MFieldLabel from "./MFieldLabel.vue"

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

    accept?: string | string[]
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
    accept: "",
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

const localError = ref<string | null>(
  null,
)

const displayError = computed(() => {
  return localError.value
    ?? props.error
    ?? null
})

const acceptValue = computed(() => {
  if (!Array.isArray(props.accept))
    return props.accept

  return props.accept
    .map((item) => {
      const value =
        String(item).trim()

      if (!value)
        return ""

      if (
        value.startsWith(".")
        || value.includes("/")
      ) {
        return value
      }

      return `.${value}`
    })
    .filter(Boolean)
    .join(",")
})

function validateFileSize(
  files: File[],
) {
  if (!props.maxSizeMb)
    return null

  const maxBytes =
    props.maxSizeMb
    * 1024
    * 1024

  const invalidFile =
    files.find(
      file =>
        file.size > maxBytes,
    )

  if (!invalidFile)
    return null

  return (
    `${invalidFile.name} exceeds `
    + `${props.maxSizeMb} MB.`
  )
}

function handleChange(
  event: Event,
) {
  localError.value = null

  const input =
    event.target as HTMLInputElement

  const files: File[] =
    input.files
      ? Array.from(input.files)
      : []

  if (!files.length) {
    emit(
      "update:modelValue",
      null,
    )

    return
  }

  const sizeError =
    validateFileSize(files)

  if (sizeError) {
    localError.value =
      sizeError

    emit(
      "error",
      sizeError,
    )

    emit(
      "update:modelValue",
      null,
    )

    input.value = ""

    return
  }

  const file = files[0]

  if (!file) {
    emit(
      "update:modelValue",
      null,
    )

    return
  }

  const value: File | File[] =
    props.multiple
      ? files
      : file

  emit(
    "update:modelValue",
    value,
  )
}

</script>

<template>
  <div class="grid gap-2">
    <MFieldLabel
      :label="props.label"
      :required="props.required"
    />

    <Input
      type="file"
      :accept="acceptValue"
      :multiple="props.multiple"
      :disabled="props.disabled"
      @change="handleChange"
    />

    <MFieldHint
      :text="props.hint"
    />

    <MFieldError
      :error="displayError"
    />
  </div>
</template>