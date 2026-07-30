<script setup lang="ts">
import MDialog from "@framework/components/dialogs/MDialog.vue"
import type { ChartPointPayload } from "./types"

defineProps<{
  open: boolean
  payload?: ChartPointPayload | null
  title?: string
}>()

defineEmits<{
  (e: "update:open", value: boolean): void
}>()
</script>

<template>
  <MDialog
    :open="open"
    :title="title ?? 'Chart Summary'"
    width="md"
    @update:open="$emit('update:open', $event)"
  >
    <div v-if="payload" class="grid gap-3 py-2">
      <div
        v-for="(value, key) in payload.data ?? payload"
        :key="key"
        class="flex items-center justify-between border-b py-2 text-sm"
      >
        <span class="text-muted-foreground">{{ key }}</span>
        <span class="font-medium">{{ value }}</span>
      </div>
    </div>

    <div v-else class="py-10 text-center text-sm text-muted-foreground">
      No summary selected.
    </div>
  </MDialog>
</template>