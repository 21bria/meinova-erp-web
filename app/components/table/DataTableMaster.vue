<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/vue-table"
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table"

import { ref, watch, computed } from "vue"
import { valueUpdater } from "@/lib/utils"
import DataTablePagination from "./DataTablePagination.vue"
import DataTableToolbarMaster from "./DataTableToolbarMaster.vue"
import type { FilterSchema } from "@/types/table"

interface Props {
  columns: ColumnDef<any, any>[]
  data: any[]
  total: number
  totalPages: number
  page: number
  pageSize: number
  search: string
  loading?: boolean
  filtersSchema: FilterSchema[]

  showAdd?: boolean
  showImport?: boolean
  showExport?: boolean
  showBulkDelete?: boolean
  showRangeDelete?: boolean
  showDownloadTemplate?: boolean
  showSyncData?: boolean

  disableAdd?: boolean
  disableImport?: boolean
  disableExport?: boolean
  disableBulkDelete?: boolean
  disableRangeDelete?: boolean
  disableDownloadTemplate?: boolean
  disableSyncData?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAdd: true,
  showImport: true,
  showExport: true,
  showBulkDelete: true,
  showRangeDelete: true,
  showDownloadTemplate: true,
  showSyncData: true,

  disableAdd: false,
  disableImport: false,
  disableExport: false,
  disableBulkDelete: false,
  disableRangeDelete: false,
  disableDownloadTemplate: false,
  disableSyncData: false,
})

const emit = defineEmits<{
  (e: "update:search", v: string): void
  (e: "applyFilters", v: { search: string; filters: Record<string, any> }): void
  (e: "resetFilters"): void
  (e: "changePage", v: number): void
  (e: "changePageSize", v: number): void
  (e: "changeSorting", v: { key: string | null; dir: "asc" | "desc" | null }): void

  (e: "add"): void
  (e: "import"): void
  (e: "export"): void
  (e: "bulk-delete", ids: string[]): void
  (e: "range-delete"): void
  (e: "download-template"): void
  (e: "sync-data"): void
}>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

watch(
  sorting,
  () => {
    const s = sorting.value?.[0]
    if (!s) return emit("changeSorting", { key: null, dir: null })
    emit("changeSorting", { key: String(s.id), dir: s.desc ? "desc" : "asc" })
  },
  { deep: true }
)

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getRowId: (row, index) => String((row as any)?.id ?? index),

  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
    get rowSelection() {
      return rowSelection.value
    },
  },

  enableRowSelection: true,
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),

  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
})

const selectedCount = computed(() => Object.keys(rowSelection.value || {}).length)

function emitBulkDelete() {
  const selectedRows = table.getSelectedRowModel().rows

  const ids = selectedRows
    .map((r) => String((r.original as any)?.id ?? "").trim())
    .filter(Boolean)

  emit("bulk-delete", ids)
}

function emitRangeDelete() {
  emit("range-delete")
}
</script>

<template>
  <div class="space-y-4">
    <DataTableToolbarMaster
      :search="search"
      :filters="filtersSchema"
      :loading="loading"

      :showAdd="props.showAdd"
      :showImport="props.showImport"
      :showExport="props.showExport"
      :showBulkDelete="props.showBulkDelete"
      :showRangeDelete="props.showRangeDelete"
      :showDownloadTemplate="props.showDownloadTemplate"
      :showSyncData="props.showSyncData"

      :disableAdd="props.disableAdd || props.loading"
      :disableImport="props.disableImport || props.loading"
      :disableExport="props.disableExport || props.loading"
      :disableBulkDelete="props.disableBulkDelete || props.loading || selectedCount === 0"
      :disableRangeDelete="props.disableRangeDelete || props.loading"
      :disableDownloadTemplate="props.disableDownloadTemplate || props.loading"
      :disableSyncData="props.disableSyncData || props.loading"

      @update:search="emit('update:search', $event)"
      @apply="emit('applyFilters', $event)"
      @reset="emit('resetFilters')"

      @add="emit('add')"
      @import="emit('import')"
      @export="emit('export')"
      @bulk-delete="emitBulkDelete"
      @range-delete="emitRangeDelete"
      @download-template="emit('download-template')"
      @sync-data="emit('sync-data')"
    />

    <div class="relative">
    <div class="border rounded-md overflow-x-auto table-scrollbar scroll-smooth">
          <Table class="min-w-max">
          <TableHeader>
            <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <TableHead v-for="header in headerGroup.headers" :key="header.id">
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <template v-if="table.getRowModel().rows?.length">
              <TableRow
                v-for="row in table.getRowModel().rows"
                :key="row.id"
                :data-state="row.getIsSelected() && 'selected'"
              >
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
            </template>

            <TableRow v-else>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div
        v-if="loading"
        class="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center rounded-md"
      >
        <div class="text-sm text-muted-foreground">Loading...</div>
      </div>
    </div>

    <DataTablePagination
      :page="page"
      :pageSize="pageSize"
      :total="total"
      :loading="loading"
      @update:page="emit('changePage', $event)"
      @update:pageSize="emit('changePageSize', $event)"
    />
  </div>
</template>