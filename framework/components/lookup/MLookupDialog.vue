<script setup lang="ts">
import MDialog from "../dialogs/MDialog.vue"

defineProps<{
  open: boolean
  title?: string
}>()

defineEmits<{
  (e: "update:open", value: boolean): void
}>()
</script>

<template>
  <MDialog
    :open="open"
    :title="title ?? 'Lookup'"
    width="lg"
    @update:open="(v) => $emit('update:open', v)"
  >
    <slot />
  </MDialog>
</template>