<script setup lang="ts">
import MCrudToolbar from "../crud/MCrudToolbar.vue"
import type { CrudFilters } from "@framework"

withDefaults(defineProps<{
  search?: string
  filtersSchema?: CrudFilters
  loading?: boolean

  showAdd?: boolean
  showImport?: boolean
  showExport?: boolean
  showBulkDelete?: boolean

  disableAdd?: boolean
  disableImport?: boolean
  disableExport?: boolean
  disableBulkDelete?: boolean
}>(), {
  search: "",
  loading: false,
  showAdd: true,
  showImport: false,
  showExport: false,
  showBulkDelete: false,
})

const emit = defineEmits<{
  (e: "update:search", value: string): void
  (e: "apply", value: { search: string; filters: Record<string, any> }): void
  (e: "reset"): void
  (e: "add"): void
  (e: "import"): void
  (e: "export"): void
  (e: "bulk-delete"): void
}>()
</script>

<template>
  <MCrudToolbar
    :search="search"
    :filters-schema="filtersSchema"
    :loading="loading"
    :show-add="showAdd"
    :show-import="showImport"
    :show-export="showExport"
    :show-bulk-delete="showBulkDelete"
    :disable-add="disableAdd"
    :disable-import="disableImport"
    :disable-export="disableExport"
    :disable-bulk-delete="disableBulkDelete"
    @update:search="(v) => emit('update:search', v)"
    @apply="(v) => emit('apply', v)"
    @reset="() => emit('reset')"
    @add="() => emit('add')"
    @import="() => emit('import')"
    @export="() => emit('export')"
    @bulk-delete="() => emit('bulk-delete')"
  />
</template>