<script setup lang="ts">
import { DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import type {
  DialogWidth,
} from "../../core/types/form"

import MDialog from "./MDialog.vue"

defineProps<{
  open: boolean
  title?: string
  description?: string
  width?: DialogWidth
  loading?: boolean
  disabled?: boolean
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
    @update:open="value => emit('update:open', value)"
  >
    <div class="overflow-y-auto py-2 pr-2">
      <slot />
    </div>

    <!--
      Slot `actions` untuk tombol yang menembak endpoint `@action` milik
      record ini — Copy, Submit, Approve. Ditaruh di kiri dan didorong
      menjauh dengan `mr-auto`: Save dan Cancel harus tetap di tempat
      yang sama di seluruh dialog, kalau tidak posisinya bergeser
      tergantung modul mana yang kebetulan punya action.
    -->
    <DialogFooter class="border-t pt-4 sm:justify-end">
      <div v-if="$slots.actions" class="mr-auto flex items-center gap-2">
        <slot name="actions" />
      </div>

      <Button
        type="button"
        variant="outline"
        :disabled="loading"
        @click="emit('update:open', false)"
      >
        {{ cancelLabel ?? $t('common.actions.cancel') }}
      </Button>

      <Button
        type="button"
        :disabled="loading || disabled"
        @click="emit('submit')"
      >
        {{ loading ? $t('common.actions.saving') : saveLabel ?? $t('common.actions.save') }}
      </Button>
    </DialogFooter>
  </MDialog>
</template>