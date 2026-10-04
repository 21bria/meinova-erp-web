<script setup lang="ts">
import {
  MImportWorkspace,
} from "@framework"

import type {
  ImportConfirmResult,
} from "@framework"

import {
  leaveOpeningBalancesImportSchema,
} from "./schema"

const emit = defineEmits<{
  (event: "imported", result: ImportConfirmResult): void
}>()

const router = useRouter()

async function handleBack() {
  await router.push("/hr/leave-opening-balances")
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
    :schema="leaveOpeningBalancesImportSchema"
    @back="handleBack"
    @imported="handleImported"
  />
</template>
