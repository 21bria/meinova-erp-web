<script setup lang="ts">
import { computed, ref, watch } from "vue"

import {
  MForm,
  MFormBuilder,
  MFormDialog,
} from "@framework"

import { userForm } from "@/modules/administration/security/users/form"

type UserRole = "SYSTEM" | "MANAGEMENT" | "VIEWER" | "USER"

export type UserPayload = {
  id?: number
  username: string
  email?: string
  first_name?: string
  last_name?: string
  password?: string
  is_active: boolean
  is_staff?: boolean
}

const props = defineProps<{
  open: boolean
  mode: "create" | "edit"
  role: UserRole
  initial?: Record<string, any> | null
  loading?: boolean
  errors?: Record<string, any> | null
}>()

const emit = defineEmits<{
  (e: "update:open", value: boolean): void
  (e: "submit", payload: UserPayload): void
}>()

const canMutate = computed(() =>
  props.role !== "VIEWER"
)

const title = computed(() =>
  props.mode === "create" ? "Add User" : "Edit User",
)

const local = ref<Record<string, any>>({
  id: undefined,
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  is_active: true,
  is_staff: false,
})

function submit() {
  const payload: UserPayload = {
    id: local.value.id,
    username: String(local.value.username ?? "").trim(),
    email: String(local.value.email ?? "").trim(),
    first_name: String(local.value.first_name ?? "").trim(),
    last_name: String(local.value.last_name ?? "").trim(),
    is_active: Boolean(local.value.is_active),
    is_staff: Boolean(local.value.is_staff),
  }

  const password = String(local.value.password ?? "").trim()

  if (password) {
    payload.password = password
  }

  emit("submit", payload)
}

watch(
  () => props.open,
  (open) => {
    if (!open) return

    local.value = {
      id: props.initial?.id,
      username: props.initial?.username ?? "",
      email: props.initial?.email ?? "",
      first_name: props.initial?.first_name ?? "",
      last_name: props.initial?.last_name ?? "",
      password: "",
      is_active: props.initial?.is_active ?? true,
      is_staff: props.initial?.is_staff ?? false,
    }
  },
  { immediate: true },
)
</script>

<template>
  <MFormDialog
    :open="open"
    :title="title"
    width="lg"
    :loading="loading"
    :save-label="mode === 'create' ? 'Create' : 'Save'"
    @update:open="(v) => emit('update:open', v)"
    @submit="submit"
  >
    <MForm @submit="submit">
      <MFormBuilder
        v-model="local"
        :schema="userForm"
        :errors="errors"
        :mode="mode"
        :disabled="!canMutate"
      />

      <p v-if="errors?.detail" class="text-sm text-destructive">
        {{ Array.isArray(errors.detail) ? errors.detail[0] : errors.detail }}
      </p>
    </MForm>
  </MFormDialog>
</template>