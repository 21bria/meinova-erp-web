<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type {
  DialogWidth,
} from "../../core/types/form"

const props = defineProps<{
  open: boolean
  title?: string
  description?: string
  width?: DialogWidth
}>()

const emit = defineEmits<{
  (e: "update:open", value: boolean): void
}>()

const widthClass: Record<DialogWidth, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
  "5xl": "sm:max-w-5xl",
  "6xl": "sm:max-w-6xl",
  "7xl": "sm:max-w-7xl",
}
</script>

<template>
  <Dialog
    :open="open"
    @update:open="(value) => emit('update:open', value)"
  >
    <DialogContent
      class="flex max-h-[90dvh] flex-col overflow-hidden p-0"
      :class="widthClass[props.width ?? 'lg']"
    >
      <DialogHeader
        v-if="title || description"
        class="shrink-0 border-b px-6 py-4"
      >
        <DialogTitle v-if="title">
          {{ title }}
        </DialogTitle>

        <DialogDescription v-if="description">
          {{ description }}
        </DialogDescription>
      </DialogHeader>

      <div
        class="
          min-h-0 flex-1
          overflow-y-auto
          overscroll-contain
          px-6 py-4
        "
      >
        <slot />
      </div>
    </DialogContent>
  </Dialog>
</template>