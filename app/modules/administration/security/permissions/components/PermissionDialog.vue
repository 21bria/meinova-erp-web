<script setup lang="ts">
import { computed, ref, watch } from "vue"

import {
  MForm,
  MFormDialog,
  MFormGrid,
  MInputField,
} from "@framework"

type UserRole = "SYSTEM" | "MANAGEMENT" | "GLOBAL_VIEWER" | "SITE_USER"

export type PermissionPayload = {
  id?: number
  name: string
}

const props = defineProps<{
  open: boolean
  role: UserRole
  initial?: Record<string, any> | null
  loading?: boolean
  errors?: Record<string, any> | null
}>()

const emit = defineEmits<{
  (e: "update:open", value: boolean): void
  (e: "submit", payload: PermissionPayload): void
}>()

const canMutate = computed(() => props.role !== "GLOBAL_VIEWER")

const local = ref({
  id: undefined as number | undefined,
  name: "",
  codename: "",
  app_label: "",
  model: "",
})

function fieldError(key: string) {
  const e = props.errors?.[key]
  return Array.isArray(e) ? e[0] : e ?? null
}

function submit() {
  emit("submit", {
    id: local.value.id,
    name: local.value.name.trim(),
  })
}

watch(
  () => props.open,
  (open) => {
    if (!open) return

    local.value = {
      id: props.initial?.id,
      name: props.initial?.name ?? "",
      codename: props.initial?.codename ?? "",
      app_label: props.initial?.app_label ?? props.initial?.content_type_app_label ?? "",
      model: props.initial?.model ?? props.initial?.content_type_model ?? "",
    }
  },
  { immediate: true },
)
</script>

<template>
  <MFormDialog
    :open="open"
    title="Edit Permission"
    width="lg"
    :loading="loading"
    save-label="Save"
    @update:open="(v) => emit('update:open', v)"
    @submit="submit"
  >
    <MForm @submit="submit">
      <MFormGrid :cols="2">
        <MInputField
          v-model="local.app_label"
          label="App Label"
          disabled
        />

        <MInputField
          v-model="local.model"
          label="Model"
          disabled
        />
      </MFormGrid>

      <MInputField
        v-model="local.codename"
        label="Codename"
        disabled
      />

      <MInputField
        v-model="local.name"
        label="Permission Name"
        placeholder="Can view employee"
        required
        :disabled="!canMutate"
        :error="fieldError('name')"
      />

      <p v-if="fieldError('detail')" class="text-sm text-destructive">
        {{ fieldError('detail') }}
      </p>
    </MForm>
  </MFormDialog>
</template>