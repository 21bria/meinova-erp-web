<script setup lang="ts">
import type { ColumnDef } from "@tanstack/vue-table"
import type { CollectionAction, CrudFilters } from "@framework"

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

  /* Pesan gagal memuat daftar — dari backend, apa adanya. */
  error?: string | null

  showAdd?: boolean
  showImport?: boolean
  showExport?: boolean
  showBulkDelete?: boolean
  showTemplate?: boolean
  templateLabel?: string

  clickableRows?: boolean

  /* Aksi massal dari schema — dirender di dropdown "Actions" toolbar. */
  collectionActions?: CollectionAction[]
  selectedCount?: number
  runningAction?: string | null
}>()

const emit = defineEmits<{
  (e: "update:search", value: string): void
  (e: "applyFilters", value: { search: string; filters: Record<string, any> }): void
  (e: "resetFilters"): void
  (e: "changePage", value: number): void
  (e: "changePageSize", value: number): void
  (e: "changeSorting", value: { key: string | null; dir: "asc" | "desc" | null }): void
   (e: "rowClick", row: any): void
  (e: "add"): void
  (e: "import"): void
  (e: "export"): void
  (e: "bulk-delete"): void
  (e: "template"): void
  (e: "selectionChange", value: { ids: string[], rows: any[] }): void
  (e: "collectionAction", key: string): void
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
      :show-template="showTemplate"
      :template-label="templateLabel"
      :collection-actions="collectionActions"
      :selected-count="selectedCount"
      :running-action="runningAction"
      @update:search="(v) => emit('update:search', v)"
      @apply="(v) => emit('applyFilters', v)"
      @reset="() => emit('resetFilters')"
      @add="() => emit('add')"
      @import="() => emit('import')"
      @export="() => emit('export')"
      @bulk-delete="() => emit('bulk-delete')"
      @template="() => emit('template')"
      @collection-action="(key) => emit('collectionAction', key)"
    />
<!-- 
    <MTable
      :columns="columns"
      :data="data"
      :loading="loading"
      @change-sorting="(v) => emit('changeSorting', v)"
    /> -->
      <MTable
        :columns="columns"
        :data="data"
        :loading="loading"
        :error-text="error ?? null"
        :clickable-rows="clickableRows"
        @row-click="row => emit('rowClick', row)"
        @change-sorting="value => emit('changeSorting', value)"
        @selection-change="value => emit('selectionChange', value)"
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