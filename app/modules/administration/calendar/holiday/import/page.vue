<script setup lang="ts">
import {
  MImportWorkspace,
} from "@framework"

import type {
  ImportConfirmResult,
} from "@framework"

import {
  holidayImportSchema,
} from "./schema"

const emit = defineEmits<{
  (event: "imported", result: ImportConfirmResult): void
}>()

const router = useRouter()

async function handleBack() {
  await router.push("/administration/calendar")
}

function handleImported(
  result: ImportConfirmResult,
) {
  // Jangan redirect di sini. MImportWorkspace pindah sendiri
  // ke step Completed dan menampilkan ringkasan hasil.
  emit("imported", result)
}
</script>

<template>
  <MImportWorkspace
    :schema="holidayImportSchema"
    @back="handleBack"
    @imported="handleImported"
  />
</template>
