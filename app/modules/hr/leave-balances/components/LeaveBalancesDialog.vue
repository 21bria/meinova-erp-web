

<script setup lang="ts">
import { computed, ref, watch } from "vue"

import {
  MFormBuilder,
  MFormDialog,
  MRecordActions,
} from "@framework"

import { leaveBalancesForm } from "../form"
import { leaveBalancesRecordActions } from "../actions"
import type { LeaveBalancesPayload } from "../types"

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
  (e: "submit", payload: LeaveBalancesPayload): void
  (e: "refresh"): void
}>()

/*
 * Record action pada editor berdialog.
 *
 * Hanya di mode edit: seluruhnya menembak endpoint `{id}`, dan record
 * yang belum tersimpan tidak punya id. Sumber recordnya `props.initial`
 * (nilai dari server), bukan `local` — `visible_when` menilai keadaan
 * yang **tersimpan**, dan mengubah satu field di form tidak boleh
 * memunculkan tombol yang endpointnya belum sah untuk keadaan itu.
 */
const recordActions = computed(() =>
  props.mode === "edit" ? leaveBalancesRecordActions : [],
)

const canMutate = computed(() => props.role !== "GLOBAL_VIEWER" && props.role !== "VIEWER")

const title = computed(() =>
  props.mode === "create" ? "Add LeaveBalances" : "Edit LeaveBalances",
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

  return payload as LeaveBalancesPayload
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
      :schema="leaveBalancesForm"
      :errors="props.errors"
      :mode="props.mode"
      :disabled="!canMutate"
    />

    <template
      v-if="recordActions.length"
      #actions
    >
      <MRecordActions
        :actions="recordActions"
        :record="props.initial"
        :mode="props.mode"
        :disabled="!canMutate"
        @done="emit('refresh')"
      />
    </template>
  </MFormDialog>
</template>