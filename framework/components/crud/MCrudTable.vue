<script setup lang="ts">
import type { ColumnDef } from "@tanstack/vue-table"
import type { CrudFilters } from "@framework"

import MTable from "../table/MTable.vue"
import MPagination from "../table/MPagination.vue"
import MCrudToolbar from "./MCrudToolbar.vue"

defineProps<{
  columns: ColumnDef<any, any>[]
  data: any[]
  total: number
  page: number
  pageSize: number
  search: string
  loading?: boolean
  filtersSchema?: CrudFilters

  showAdd?: boolean
  showImport?: boolean
  showExport?: boolean
  showBulkDelete?: boolean
}>()

const emit = defineEmits<{
  (e: "update:search", value: string): void
  (e: "applyFilters", value: { search: string; filters: Record<string, any> }): void
  (e: "resetFilters"): void
  (e: "changePage", value: number): void
  (e: "changePageSize", value: number): void
  (e: "changeSorting", value: { key: string | null; dir: "asc" | "desc" | null }): void
  (e: "add"): void
  (e: "import"): void
  (e: "export"): void
  (e: "bulk-delete"): void
}>()
</script>

<template>
  <div class="space-y-4">
    <MCrudToolbar
      :search="search"
      :filters-schema="filtersSchema"
       drawer-width="xs"
      :loading="loading"
      :show-add="showAdd"
      :show-import="showImport"
      :show-export="showExport"
      :show-bulk-delete="showBulkDelete"
      @update:search="(v) => emit('update:search', v)"
      @apply="(v) => emit('applyFilters', v)"
      @reset="() => emit('resetFilters')"
      @add="() => emit('add')"
      @import="() => emit('import')"
      @export="() => emit('export')"
      @bulk-delete="() => emit('bulk-delete')"
    />

    <MTable
      :columns="columns"
      :data="data"
      :loading="loading"
      @change-sorting="(v) => emit('changeSorting', v)"
    />

    <MPagination
      :page="page"
      :page-size="pageSize"
      :total="total"
      :loading="loading"
      @update:page="(v) => emit('changePage', v)"
      @update:page-size="(v) => emit('changePageSize', v)"
    />

    <slot />
  </div>
</template>