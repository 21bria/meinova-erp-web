<script setup lang="ts">
import { DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import MDialog from "./MDialog.vue"

defineProps<{
  open: boolean
  title?: string
  description?: string
  width?: "sm" | "md" | "lg" | "xl" |  "3xl" | "4xl" | "5xl" | "6xl" | "7xl"
  loading?: boolean
  saveLabel?: string
  cancelLabel?: string
}>()

const emit = defineEmits<{
  (e: "update:open", value: boolean): void
  (e: "submit"): void
}>()
</script>

<template>
  <MDialog
    :open="open"
    :title="title"
    :description="description"
    :width="width"
    @update:open="(v) => emit('update:open', v)"
  >
    <div class="overflow-y-auto py-2 pr-2">
      <slot />
    </div>

    <DialogFooter class="border-t pt-4">
      <Button variant="outline" @click="emit('update:open', false)">
        {{ cancelLabel ?? "Cancel" }}
      </Button>

      <Button :disabled="loading" @click="emit('submit')">
        {{ loading ? "Saving..." : saveLabel ?? "Save" }}
      </Button>
    </DialogFooter>
  </MDialog>
</template>