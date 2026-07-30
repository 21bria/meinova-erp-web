<script setup lang="ts">
import { ref, watch, computed } from "vue"

import {
  MFormDialog,
  MForm,
  MFormGrid,
  MInputField,
  MTextareaField,
  MSwitchField,
} from "@framework"

type UserRole = "SYSTEM" | "MANAGEMENT" | "VIEWER" | "USER"

export type RolePayload = {
  id?: number
  code: string
  name: string
  description?: string
  is_active: boolean
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
  (e: "update:open", v: boolean): void
  (e: "submit", payload: RolePayload): void
}>()

const canMutate = computed(() => props.role !== "VIEWER")
const title = computed(() => props.mode === "create" ? "Add Role" : "Edit Role")

const local = ref({
  id: undefined as number | undefined,
  code: "",
  name: "",
  description: "",
  is_active: true,
})

function fieldError(key: string) {
  const e = props.errors?.[key]
  return Array.isArray(e) ? e[0] : e ?? null
}

function submit() {
  emit("submit", {
    id: local.value.id,
    code: local.value.code.trim().toUpperCase(),
    name: local.value.name.trim(),
    description: local.value.description.trim(),
    is_active: local.value.is_active,
  })
}

watch(
  () => props.open,
  (open) => {
    if (!open) return

    local.value = {
      id: props.initial?.id,
      code: props.initial?.code ?? "",
      name: props.initial?.name ?? "",
      description: props.initial?.description ?? "",
      is_active: props.initial?.is_active ?? true,
    }
  },
  { immediate: true },
)
</script>

<template>
  <MFormDialog
    :open="open"
    :title="title"
    width="md"
    :loading="loading"
    :save-label="mode === 'create' ? 'Create' : 'Save'"
    @update:open="(v) => emit('update:open', v)"
    @submit="submit"
  >
    <MForm @submit="submit">
      <MFormGrid :cols="2">
        <MInputField
          v-model="local.code"
          label="Code"
          placeholder="e.g. HR_MANAGER"
          required
          :disabled="!canMutate"
          :error="fieldError('code')"
        />

        <MInputField
          v-model="local.name"
          label="Role Name"
          placeholder="e.g. HR Manager"
          required
          :disabled="!canMutate"
          :error="fieldError('name')"
        />
      </MFormGrid>

      <MTextareaField
        v-model="local.description"
        label="Description"
        placeholder="Role description"
        :disabled="!canMutate"
        :error="fieldError('description')"
      />

      <MSwitchField
        v-model="local.is_active"
        label="Active"
        :disabled="!canMutate"
      />

      <p v-if="fieldError('detail')" class="text-sm text-destructive">
        {{ fieldError('detail') }}
      </p>
    </MForm>
  </MFormDialog>
</template>