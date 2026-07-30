<script setup lang="ts">
import ConfirmDelete from "@/components/forms/confirm-delete.vue"

defineProps<{
  open: boolean
  title?: string
  description?: string
}>()

const emit = defineEmits<{
  (e: "update:open", value: boolean): void
  (e: "confirm"): void
}>()
</script>

<template>
  <ConfirmDelete
    :open="open"
    :title="title ?? 'Confirm Action'"
    :description="description ?? 'Are you sure you want to continue?'"
    @update:open="(v) => emit('update:open', v)"
    @confirm="() => emit('confirm')"
  />
</template>