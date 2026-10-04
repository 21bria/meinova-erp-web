<script setup lang="ts">
import { useI18n } from "vue-i18n"

import {
  computed,
  ref,
  watch,
} from "vue"

import type {
  FormField,
} from "../../../builders/forms/types"

import type {
  DialogWidth,
  FormErrors,
} from "../../../core/types/form"

const props = withDefaults(
  defineProps<{
    open: boolean
    mode: "create" | "edit"

    schema?: FormField[]
    initial?: Record<string, any> | null

    loading?: boolean
    errors?: FormErrors

    title?: string
    description?: string
    width?: DialogWidth
    disabled?: boolean
  }>(),
  {
    schema: () => [],
    initial: null,
    loading: false,
    errors: null,
    title: "",
    description: "",
    width: "lg",
    disabled: false,
  },
)

const emit = defineEmits<{
  "update:open": [value: boolean]
  submit: [payload: Record<string, any>]
}>()

const { t } = useI18n()

const model = ref<Record<string, any>>({})

const displayTitle = computed(() => {
  if (props.title)
    return props.title

  return props.mode === "create"
    ? t("common.actions.addRecord")
    : t("common.actions.editRecord")
})

watch(
  [
    () => props.open,
    () => props.initial,
  ],
  ([open, initial]) => {
    if (!open)
      return

    model.value = {
      ...(initial ?? {}),
    }
  },
  {
    immediate: true,
    deep: true,
  },
)

function buildSubmitPayload(
  values: Record<string, any>,
  schema: FormField[],
) {
  const payload: Record<string, any> = {}

  for (const field of schema) {
    const key = field.key

    if (field.readonly === true) {
        continue
      }

    if (key.endsWith("_detail"))
      continue

    const value = values[key]

    if (
      field.type === "file"
      && (
        field.widget === "upload"
        || field.widget === "image-upload"
        || field.uploadMode === "separate"
        || field.upload_mode === "separate"
      )
    ) {
      payload[key] = value ?? null
      continue
    }

    payload[key] = value
  }

  return payload
}

function submit() {
  const payload = buildSubmitPayload(
    model.value,
    props.schema,
  )

  console.log(
    "RESOURCE MODEL",
    model.value,
  )

  console.log(
    "RESOURCE PAYLOAD",
    payload,
  )

  emit(
    "submit",
    payload,
  )
}
</script>

<template>
  <MFormDialog
    :open="props.open"
    :title="displayTitle"
    :description="props.description"
    :loading="props.loading"
    :width="props.width"
    :disabled="props.disabled"
    @update:open="
      value => emit('update:open', value)
    "
    @submit="submit"
  >
    <MFormBuilder
      v-model="model"
      :schema="props.schema"
      :errors="props.errors"
      :mode="props.mode"
      :disabled="
        props.disabled
        || props.loading
      "
    />
  </MFormDialog>
</template>

