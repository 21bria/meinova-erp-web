<script setup lang="ts">
import {
  MImportWorkspace,
} from "@framework"

import type {
  ImportConfirmResult,
} from "@framework"

import {
  attendanceImportSchema,
} from "./schema"

const emit = defineEmits<{
  (event: "imported", result: ImportConfirmResult): void
}>()

const router = useRouter()

async function handleBack() {
  await router.push("/hr/attendance")
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
    :schema="attendanceImportSchema"
    @back="handleBack"
    @imported="handleImported"
  />
</template>
