<script setup lang="ts">
import type {
  ColumnDef,
  SortingState,
  VisibilityState,
} from "@tanstack/vue-table"
import {
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table"

import { ref, watch } from "vue"
import { valueUpdater } from "@/lib/utils"

const props = defineProps<{
  columns: ColumnDef<any, any>[]
  data: any[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: "changeSorting", value: { key: string | null; dir: "asc" | "desc" | null }): void
}>()

const sorting = ref<SortingState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

watch(
  sorting,
  () => {
    const s = sorting.value?.[0]
    emit("changeSorting", s ? { key: String(s.id), dir: s.desc ? "desc" : "asc" } : { key: null, dir: null })
  },
  { deep: true },
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
    get columnVisibility() {
      return columnVisibility.value
    },
    get rowSelection() {
      return rowSelection.value
    },
  },

  enableRowSelection: true,
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),

  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
</script>

<template>
  <div class="relative">
    <div class="overflow-x-auto rounded-md border table-scrollbar scroll-smooth">
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
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
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
      class="absolute inset-0 flex items-center justify-center rounded-md bg-background/60 backdrop-blur-[1px]"
    >
      <div class="text-sm text-muted-foreground">
        Loading...
      </div>
    </div>
  </div>
</template>