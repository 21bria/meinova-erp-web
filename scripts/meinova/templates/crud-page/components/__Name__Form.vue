<script setup lang="ts">
import { computed, ref, watch } from "vue"

import {
  MForm,
  MFormBuilder,
} from "@framework"

import { __name__Form } from "../form"
import type { __Name__Payload } from "../types"

type UserRole =
  | "SYSTEM"
  | "MANAGEMENT"
  | "GLOBAL_VIEWER"
  | "VIEWER"
  | "SITE_USER"

const props = defineProps<{
  mode: "create" | "edit"
  role?: UserRole
  initial?: Record<string, any> | null
  loading?: boolean
  errors?: Record<string, any> | null
}>()

const emit = defineEmits<{
  (e: "submit", payload: __Name__Payload): void
  (e: "cancel"): void
}>()

const canMutate = computed(
  () =>
    props.role !== "GLOBAL_VIEWER"
    && props.role !== "VIEWER",
)

const local = ref<Record<string, any>>({})

function normalizeId(value: any): number | null {
  if (value == null || value === "")
    return null

  const normalized = Number(
    value?.value
    ?? value?.id
    ?? value,
  )

  return Number.isFinite(normalized)
    ? normalized
    : null
}

function normalizePayload(
  value: Record<string, any>,
): __Name__Payload {
  const payload: Record<string, any> = {}

  for (const [key, raw] of Object.entries(value)) {
    if (
      raw
      && typeof raw === "object"
      && ("id" in raw || "value" in raw)
    ) {
      payload[key] = normalizeId(raw)
      continue
    }

    if (typeof raw === "string") {
      payload[key] = raw.trim()
      continue
    }

    payload[key] = raw
  }

  return payload as __Name__Payload
}

function submit() {
  emit(
    "submit",
    normalizePayload(local.value),
  )
}

watch(
  () => props.initial,
  initial => {
    local.value = {
      ...(initial ?? {}),
    }
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>

<template>
  <MForm @submit="submit">
    <div class="space-y-6">
      <MFormBuilder
        v-model="local"
        :schema="__name__Form"
        :errors="props.errors"
        :mode="props.mode"
        :disabled="!canMutate || props.loading"
      />

      <div class="flex items-center justify-end gap-3 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          :disabled="props.loading"
          @click="emit('cancel')"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          :disabled="!canMutate || props.loading"
        >
          {{
            props.loading
              ? "Saving..."
              : props.mode === "create"
                ? "Create"
                : "Save Changes"
          }}
        </Button>
      </div>
    </div>
  </MForm>
</template>