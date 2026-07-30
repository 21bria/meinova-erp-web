

<script setup lang="ts">
import { computed, ref, watch } from "vue"

import {
  MFormBuilder,
  MFormDialog,
} from "@framework"

import { payrollGroupsForm } from "../form"
import type { PayrollGroupsPayload } from "../types"

type UserRole = "SYSTEM" | "MANAGEMENT" | "GLOBAL_VIEWER" | "VIEWER" | "SITE_USER"

const props = defineProps<{
  open: boolean
  mode: "create" | "edit"
  role?: UserRole
  initial?: Record<string, any> | null
  loading?: boolean
  errors?: Record<string, any> | null
}>()

const emit = defineEmits<{
  (e: "update:open", value: boolean): void
  (e: "submit", payload: PayrollGroupsPayload): void
}>()

const canMutate = computed(() => props.role !== "GLOBAL_VIEWER" && props.role !== "VIEWER")

const title = computed(() =>
  props.mode === "create" ? "Add PayrollGroups" : "Edit PayrollGroups",
)

const local = ref<Record<string, any>>({})

function normalizeId(value: any): number | null {
  if (value == null || value === "")
    return null

  const normalized = Number(value?.value ?? value?.id ?? value)
  return Number.isFinite(normalized) ? normalized : null
}

function normalizePayload(value: Record<string, any>) {
  const payload: Record<string, any> = {}

  for (const [key, raw] of Object.entries(value)) {
    if (raw && typeof raw === "object" && ("id" in raw || "value" in raw)) {
      payload[key] = normalizeId(raw)
      continue
    }

    if (typeof raw === "string") {
      payload[key] = raw.trim()
      continue
    }

    payload[key] = raw
  }

  return payload as PayrollGroupsPayload
}

function close() {
  emit("update:open", false)
}

function submit() {
  emit("submit", normalizePayload(local.value))
}

watch(
  () => props.open,
  open => {
    if (!open)
      return

    local.value = { ...(props.initial ?? {}) }
  },
  { immediate: true },
)
</script>

<template>
  <MFormDialog
    :open="props.open"
    :title="title"
    :loading="props.loading"
    width="lg"
    :disabled="!canMutate"
    @update:open="value => emit('update:open', value)"
    @submit="submit"
  >
    <MFormBuilder
      v-model="local"
      :schema="payrollGroupsForm"
      :errors="props.errors"
      :mode="props.mode"
      :disabled="!canMutate"
    />
  </MFormDialog>
</template>