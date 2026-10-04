<script setup lang="ts">
import { computed, ref } from "vue"

import {
  MCrudDelete,
  MCrudTable,
  useCrud,
  useCrudBulkDelete,
  useCrudDelete,
  useCrudExport,
} from "@framework"

import { get__Name__Columns } from "../columns"
import { __name__Filters } from "../filters"
import { __name__Config } from "../table"

import type {
  __Name__Row,
} from "../types"

const router = useRouter()

const crud = useCrud<__Name__Row>({
  ...__name__Config,
  name: __name__Config.id,
})

const remove = useCrudDelete<__Name__Row>(crud)

const notify = useNotify()

/*
|--------------------------------------------------------------------------
| Import / Export / Bulk delete
|--------------------------------------------------------------------------
|
| Tombolnya dirender lewat `crud.ui`; tanpa handler di bawah ini ia
| tampil, ditekan, dan tidak terjadi apa-apa. Endpoint import bersifat
| generik per module di backend, jadi bisa diturunkan dari path module.
|
*/

const selectedIds = ref<string[]>([])

const bulk = useCrudBulkDelete(crud, {
  entity: "__kebab__",
  notify,
})

const exporter = useCrudExport({
  endpoint: `${__name__Config.endpoint}export/`,
  templateEndpoint: "/api/imports/__modulePath__/template/",
  filename: "__kebab__-export.csv",
  notify,
  query: () => ({
    ...crud.serverFilters.value,
    search: crud.search.value || undefined,
    ordering: crud.ordering.value || undefined,
  }),
})

function onSelectionChange(
  value: { ids: string[], rows: any[] },
) {
  selectedIds.value = value.ids
}

async function openImport() {
  await router.push("/__modulePath__/import")
}

function askBulkDelete() {
  bulk.ask(selectedIds.value)
}

async function confirmBulkDelete() {
  await bulk.confirm()

  selectedIds.value = []
}

function openCreate() {
  router.push("/__modulePath__/create")
}

function openEdit(row: __Name__Row) {
  if (row.id == null)
    return

  router.push(`/__modulePath__/${row.id}/edit`)
}

const columns = computed(() =>
  get__Name__Columns({
    onEdit: crud.ui.value.edit
      ? openEdit
      : undefined,

    onDelete: crud.ui.value.delete
      ? remove.ask
      : undefined,
  }),
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <MCrudTable
      :columns="columns"
      :data="crud.rows.value"
      :total="crud.total.value"
      :page="crud.page.value"
      :page-size="crud.pageSize.value"
      :search="crud.search.value"
      :loading="crud.pending.value"
      :filters-schema="__name__Filters"
      :show-add="crud.ui.value.create"
      :show-import="crud.ui.value.import"
      :show-export="crud.ui.value.export"
      :show-bulk-delete="crud.ui.value.bulk_delete"
      :show-template="crud.ui.value.import"
      @update:search="crud.onSearch"
      @apply-filters="crud.onApply"
      @reset-filters="crud.onReset"
      @change-page="crud.onChangePage"
      @change-page-size="crud.onChangePageSize"
      @change-sorting="crud.onSort"
      @add="openCreate"
      @import="openImport"
      @export="exporter.exportData"
      @template="exporter.downloadTemplate"
      @bulk-delete="askBulkDelete"
      @selection-change="onSelectionChange"
    />

    <MCrudDelete
      v-if="crud.ui.value.delete"
      v-model:open="remove.open.value"
      :title="`Delete ${__name__Config.id}`"
      description="Are you sure you want to delete this record?"
      @confirm="remove.confirm"
    />

    <MCrudDelete
      v-if="crud.ui.value.bulk_delete"
      v-model:open="bulk.open.value"
      :title="`Delete ${bulk.ids.value.length} record(s)`"
      description="Are you sure you want to delete all selected records?"
      @confirm="confirmBulkDelete"
    />
  </div>
</template>