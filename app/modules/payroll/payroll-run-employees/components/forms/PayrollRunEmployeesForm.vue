<script setup lang="ts">
import {
  computed,
} from "vue"

import {
  MFormBuilder,
} from "@framework"

import {
  payrollRunEmployeesForm,
} from "../../form"

import type {
  PayrollRunEmployeesWorkspaceMode,
} from "../../composables/usePayrollRunEmployeesWorkspace"

type FormMode = Exclude<
  PayrollRunEmployeesWorkspaceMode,
  "list"
>

const props = withDefaults(
  defineProps<{
    mode: FormMode
    tabKey: string
    fields?: string[] | null
    modelValue: Record<string, any>
    loading?: boolean
    readonly?: boolean
    disabled?: boolean
    errors?: Record<string, any> | null
    emptyText?: string
  }>(),
  {
    fields: null,
    loading: false,
    readonly: false,
    disabled: false,
    errors: null,
    emptyText: "No form fields configured for this section.",
  },
)

const emit = defineEmits<{
  "update:modelValue": [
    value: Record<string, any>,
  ]
}>()

const isReadonly = computed(() => {
  return (
    props.mode === "detail"
    || props.readonly
  )
})

const builderMode = computed<
  "create" | "edit"
>(() => {
  return props.mode === "create"
    ? "create"
    : "edit"
})

const formSchema = computed(() => {
  return Array.isArray(payrollRunEmployeesForm)
    ? payrollRunEmployeesForm
    : []
})

const configuredFields = computed(() => {
  return new Set(
    Array.isArray(props.fields)
      ? props.fields
          .map(field => String(field))
          .filter(Boolean)
      : [],
  )
})

const tabSchema = computed(() => {
  const hasConfiguredFields =
    configuredFields.value.size > 0

  return formSchema.value.filter((field) => {
    if (!field?.key)
      return false

    if (hasConfiguredFields) {
      return configuredFields.value.has(
        String(field.key),
      )
    }

    return (
      (field.tab ?? "general")
      === props.tabKey
    )
  })
})

const tabErrors = computed(() => {
  if (!props.errors)
    return null

  const fieldKeys = new Set(
    tabSchema.value.map(
      field => String(field.key),
    ),
  )

  return Object.fromEntries(
    Object.entries(props.errors).filter(
      ([key]) => fieldKeys.has(key),
    ),
  )
})

const isDisabled = computed(() => {
  return (
    props.loading
    || props.disabled
    || isReadonly.value
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
  <div
    :data-workspace-tab="tabKey"
    class="space-y-6"
  >
    <MFormBuilder
      v-if="tabSchema.length > 0"
      :model-value="modelValue"
      :schema="tabSchema"
      :errors="tabErrors"
      :mode="builderMode"
      :disabled="isDisabled"
      @update:model-value="updateModel"
    />

    <div
      v-else
      class="
        flex min-h-40 items-center
        justify-center rounded-md
        border border-dashed
      "
    >
      <p class="text-sm text-muted-foreground">
        {{ emptyText }}
      </p>
    </div>
  </div>
</template>