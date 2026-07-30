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
    :title="title ?? 'Delete Data'"
    :description="description ?? 'Are you sure you want to delete this data? This action cannot be undone.'"
    @update:open="(v) => emit('update:open', v)"
    @confirm="() => emit('confirm')"
  />
</template>