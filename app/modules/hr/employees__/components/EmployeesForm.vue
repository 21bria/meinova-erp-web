<script setup lang="ts">
import { computed, ref, watch } from "vue"

import { MFormBuilder } from "@framework"

import { employeesForm } from "../form"

import type {
  EmployeesPayload,
  EmployeesRow,
} from "../types"

type FormMode = "create" | "edit"

const props = withDefaults(
  defineProps<{
    mode: FormMode
    initial?: EmployeesRow | null
    loading?: boolean
    errors?: Record<string, any> | null
  }>(),
  {
    initial: null,
    loading: false,
    errors: null,
  },
)

const emit = defineEmits<{
  cancel: []
  submit: [payload: EmployeesPayload]
}>()

const local = ref<Record<string, any>>({})

const title = computed(() =>
  props.mode === "create"
    ? "Add Employee"
    : "Edit Employee",
)

const submitLabel = computed(() =>
  props.mode === "create"
    ? "Create Employee"
    : "Save Changes",
)

function normalizeLookupValue(value: any) {
  if (
    value
    && typeof value === "object"
    && ("id" in value || "value" in value)
  ) {
    return value.id ?? value.value ?? null
  }

  return value
}

function normalizePayload(
  value: Record<string, any>,
): EmployeesPayload {
  const payload: Record<string, any> = {}

  for (const [key, rawValue] of Object.entries(value)) {
    const value = normalizeLookupValue(rawValue)

    payload[key] = typeof value === "string"
      ? value.trim()
      : value
  }

  return payload as EmployeesPayload
}

function resetForm() {
  local.value = {
    ...(props.initial ?? {}),
  }
}

function handleCancel() {
  emit("cancel")
}

function handleSubmit() {
  emit(
    "submit",
    normalizePayload(local.value),
  )
}

watch(
  [
    () => props.mode,
    () => props.initial,
  ],
  resetForm,
  {
    immediate: true,
    deep: true,
  },
)
</script>

<template>
  <section class="overflow-hidden rounded-lg border bg-background">
    <header
      class="flex items-center justify-between gap-4 border-b px-6 py-4"
    >
      <div>
        <h2 class="text-lg font-semibold">
          {{ title }}
        </h2>

        <p class="text-sm text-muted-foreground">
          Complete the employee information below.
        </p>
      </div>

      <button
        type="button"
        class="inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
        :disabled="loading"
        @click="handleCancel"
      >
        Back
      </button>
    </header>

    <form
      class="space-y-6 p-6"
      @submit.prevent="handleSubmit"
    >
      <MFormBuilder
        v-model="local"
        :schema="employeesForm"
        :errors="errors"
        :mode="mode"
        :disabled="loading"
      />

      <footer
        class="flex items-center justify-end gap-2 border-t pt-5"
      >
        <button
          type="button"
          class="inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
          :disabled="loading"
          @click="handleCancel"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? "Saving..." : submitLabel }}
        </button>
      </footer>
    </form>
  </section>
</template>