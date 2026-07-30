<script setup lang="ts">
import { computed } from "vue"

import { MFormBuilder } from "@framework"

import { employeesForm } from "../form"

type FormMode =
  | "create"
  | "edit"
  | "detail"

const props = withDefaults(
  defineProps<{
    mode: FormMode
    tabKey: string
    modelValue: Record<string, any>
    loading?: boolean
    errors?: Record<string, any> | null
  }>(),
  {
    loading: false,
    errors: null,
  },
)

const emit = defineEmits<{
  "update:modelValue": [
    value: Record<string, any>,
  ]
}>()

const readonly = computed(
  () => props.mode === "detail",
)

const builderMode = computed<
  "create" | "edit"
>(() => {
  return props.mode === "create"
    ? "create"
    : "edit"
})

const tabSchema = computed(() => {
  return employeesForm.filter(
    field =>
      (field.tab ?? "general")
      === props.tabKey,
  )
})

function updateModel(
  value: Record<string, any>,
) {
  emit("update:modelValue", {
    ...props.modelValue,
    ...value,
  })
}
</script>

<template>
  <MFormBuilder
    :model-value="modelValue"
    :schema="tabSchema"
    :errors="errors"
    :mode="builderMode"
    :disabled="loading || readonly"
    @update:model-value="updateModel"
  />
</template>