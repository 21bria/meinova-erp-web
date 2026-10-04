<script setup lang="ts">
import {
  ref,
  watch,
} from "vue"

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

import {
  valueUpdater,
} from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    columns: ColumnDef<any, any>[]
    data: any[]
    loading?: boolean
    clickableRows?: boolean

    /* Daftar gagal dimuat (mis. 403). Menggantikan "No results." —
     * tabel kosong karena ditolak bukan tabel yang memang kosong. */
    errorText?: string | null
  }>(),
  {
    loading: false,
    clickableRows: false,
    errorText: null,
  },
)

const emit = defineEmits<{
  changeSorting: [
    value: {
      key: string | null
      dir: "asc" | "desc" | null
    },
  ]

  rowClick: [
    row: any,
  ]

  selectionChange: [
    value: {
      ids: string[]
      rows: any[]
    },
  ]
}>()

/*
|--------------------------------------------------------------------------
| Table state
|--------------------------------------------------------------------------
*/

const sorting = ref<SortingState>([])

const columnVisibility =
  ref<VisibilityState>({})

const rowSelection = ref<
  Record<string, boolean>
>({})

/*
|--------------------------------------------------------------------------
| Sorting
|--------------------------------------------------------------------------
*/

watch(
  sorting,
  () => {
    const current =
      sorting.value?.[0]

    emit(
      "changeSorting",
      current
        ? {
            key: String(current.id),
            dir: current.desc
              ? "desc"
              : "asc",
          }
        : {
            key: null,
            dir: null,
          },
    )
  },
  {
    deep: true,
  },
)

/*
|--------------------------------------------------------------------------
| Table instance
|--------------------------------------------------------------------------
*/

const table = useVueTable({
  get data() {
    return props.data
  },

  get columns() {
    return props.columns
  },

  getRowId: (
    row,
    index,
  ) => {
    return String(
      (row as any)?.id
      ?? index,
    )
  },

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

  onSortingChange: (
    updaterOrValue,
  ) => {
    valueUpdater(
      updaterOrValue,
      sorting,
    )
  },

  onColumnVisibilityChange: (
    updaterOrValue,
  ) => {
    valueUpdater(
      updaterOrValue,
      columnVisibility,
    )
  },

  onRowSelectionChange: (
    updaterOrValue,
  ) => {
    valueUpdater(
      updaterOrValue,
      rowSelection,
    )
  },

  getCoreRowModel:
    getCoreRowModel(),

  getSortedRowModel:
    getSortedRowModel(),
})

/*
|--------------------------------------------------------------------------
| Row selection
|--------------------------------------------------------------------------
|
| getRowId memakai row.id, jadi key pada rowSelection sudah berupa id
| record — bukan indeks baris. Dipakai untuk bulk delete di parent.
|
*/

watch(
  rowSelection,
  () => {
    const selected = table
      .getSelectedRowModel()
      .rows

    emit(
      "selectionChange",
      {
        ids: selected.map(
          row => String(row.id),
        ),

        rows: selected.map(
          row => row.original,
        ),
      },
    )
  },
  {
    deep: true,
  },
)

/*
|--------------------------------------------------------------------------
| Row click
|--------------------------------------------------------------------------
*/

function handleRowClick(
  row: any,
  event: MouseEvent,
) {
  if (!props.clickableRows)
    return

  const target =
    event.target as HTMLElement | null

  /*
   * Jangan membuka edit ketika user menekan
   * button, link, checkbox, input, atau menu
   * yang berada di dalam row.
   */
  if (
    target?.closest(
      [
        "button",
        "a",
        "input",
        "select",
        "textarea",
        "[role='button']",
        "[role='menuitem']",
        "[data-row-click-ignore]",
      ].join(","),
    )
  ) {
    return
  }

  emit(
    "rowClick",
    row.original,
  )
}
</script>

<template>
  <div class="relative">
    <div
      class="
        table-scrollbar
        overflow-x-auto
        scroll-smooth
        rounded-md
        border
      "
    >
      <Table class="min-w-max">
        <TableHeader>
          <TableRow
            v-for="
              headerGroup
              in table.getHeaderGroups()
            "
            :key="headerGroup.id"
          >
            <TableHead
              v-for="
                header
                in headerGroup.headers
              "
              :key="header.id"
            >
              <FlexRender
                v-if="
                  !header.isPlaceholder
                "
                :render="
                  header.column
                    .columnDef
                    .header
                "
                :props="
                  header.getContext()
                "
              />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <template
            v-if="
              table.getRowModel()
                .rows?.length
            "
          >
            <TableRow
              v-for="
                row
                in table.getRowModel()
                  .rows
              "
              :key="row.id"
              :data-state="
                row.getIsSelected()
                && 'selected'
              "
              :class="{
                'cursor-pointer':
                  props.clickableRows,
              }"
              @click="
                handleRowClick(
                  row,
                  $event,
                )
              "
            >
              <TableCell
                v-for="
                  cell
                  in row.getVisibleCells()
                "
                :key="cell.id"
              >
                <FlexRender
                  :render="
                    cell.column
                      .columnDef
                      .cell
                  "
                  :props="
                    cell.getContext()
                  "
                />
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else>
            <TableCell
              :colspan="
                Math.max(
                  props.columns.length,
                  1,
                )
              "
              class="
                h-24
                text-center
              "
              :class="props.errorText ? 'text-destructive' : undefined"
              :data-state="props.errorText ? 'error' : 'empty'"
            >
              {{ props.errorText || 'No results.' }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div
      v-if="props.loading"
      class="
        absolute inset-0
        flex items-center
        justify-center
        rounded-md
        bg-background/60
        backdrop-blur-[1px]
      "
    >
      <div
        class="
          text-sm
          text-muted-foreground
        "
      >
        Loading...
      </div>
    </div>
  </div>
</template>