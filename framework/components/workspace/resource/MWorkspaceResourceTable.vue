<script
  setup
  lang="ts"
  generic="TRow extends { id: string | number }"
>
import type {
  ColumnDef,
} from "@tanstack/vue-table"

const props = withDefaults(
  defineProps<{
    columns: ColumnDef<TRow, any>[]
    rows?: TRow[]
    total?: number
    page?: number
    pageSize?: number
    search?: string
    loading?: boolean
    showAdd?: boolean
    addLabel?: string
    emptyText?: string
  }>(),
  {
    rows: () => [] as TRow[],
    total: 0,
    page: 1,
    pageSize: 10,
    search: "",
    loading: false,
    showAdd: false,
    addLabel: "Add",
    emptyText: "No records found.",
  },
)

const emit = defineEmits<{
  add: []
  edit: [row: TRow]
  delete: [row: TRow]
  rowClick: [row: TRow]
  "update:search": [value: string]
  changePage: [value: number]
  changePageSize: [value: number]
  changeSorting: [
    value: {
      key: string | null
      dir: "asc" | "desc" | null
    },
  ]
}>()

function handleRowClick(
  row: unknown,
) {
  emit(
    "rowClick",
    row as TRow,
  )
}

function handleSearch(
  value: string,
) {
  emit(
    "update:search",
    value,
  )
}

function handleChangePage(
  value: number,
) {
  emit(
    "changePage",
    value,
  )
}

function handleChangePageSize(
  value: number,
) {
  emit(
    "changePageSize",
    value,
  )
}

function handleChangeSorting(
  value: {
    key: string | null
    dir: "asc" | "desc" | null
  },
) {
  emit(
    "changeSorting",
    value,
  )
}
</script>

<template>
  <MCrudTable
    :columns="props.columns"
    :data="props.rows"
    :total="props.total"
    :page="props.page"
    :page-size="props.pageSize"
    :search="props.search"
    :loading="props.loading"
    :show-add="props.showAdd"
    :show-import="false"
    :show-export="false"
    :show-bulk-delete="false"
    @add="emit('add')"
    @row-click="handleRowClick"
    @update:search="handleSearch"
    @change-page="handleChangePage"
    @change-page-size="handleChangePageSize"
    @change-sorting="handleChangeSorting"
  >
    <template #empty>
      <div
        class="
          flex min-h-36 items-center
          justify-center text-sm
          text-muted-foreground
        "
      >
        {{ props.emptyText }}
      </div>
    </template>
  </MCrudTable>
</template>