<script setup lang="ts">
import { computed, ref } from "vue"

import {
  MCrudConfirm,
  MCrudDelete,
  MCrudTable,
  useCrud,
  useCrudBulkDelete,
  useCrudCollectionActions,
  useCrudDelete,
  useCrudExport,
} from "@framework"

import {
  getAccountingEventsColumns,
} from "../columns"

import {
  accountingEventsCollectionActions,
} from "../actions"

import {
  accountingEventsFilters,
} from "../filters"

import {
  accountingEventsConfig,
} from "../table"

import type {
  AccountingEventsRow,
} from "../types"

const props = withDefaults(
  defineProps<{
    autoNavigate?: boolean
    createPath?: string
    editPath?: (
      row: AccountingEventsRow,
    ) => string
  }>(),
  {
    autoNavigate: true,
    createPath: "/finance/accounting-events/create",
    editPath: undefined,
  },
)

const emit = defineEmits<{
  select: [row: AccountingEventsRow]
  create: []
  edit: [row: AccountingEventsRow]
  deleted: [row: AccountingEventsRow | null]
}>()

const router = useRouter()

const crud = useCrud<AccountingEventsRow>({
  ...accountingEventsConfig,
  name: accountingEventsConfig.id,
})

const remove =
  useCrudDelete<AccountingEventsRow>(crud)

const notify = useNotify()

/*
|--------------------------------------------------------------------------
| Import / Export / Bulk delete
|--------------------------------------------------------------------------
|
| Endpoint import bersifat generik per module di backend, jadi bisa
| diturunkan langsung dari path module ini.
|
*/

const selectedIds = ref<string[]>([])

const bulk = useCrudBulkDelete(crud, {
  entity: "accounting-events",
  notify,
})

const exporter = useCrudExport({
  endpoint: `${accountingEventsConfig.endpoint}export/`,
  templateEndpoint: "/api/imports/finance/accounting-events/template/",
  filename: "accounting-events-export.csv",
  notify,
  query: () => ({
    ...crud.serverFilters.value,
    search: crud.search.value || undefined,
    ordering: crud.ordering.value || undefined,
  }),
})

/*
| Aksi massal dari schema (Post All dan sejenisnya).
|
| `selectedIds` dioper sebagai fungsi, bukan nilai: composable-nya
| membacanya tepat saat tombolnya ditekan. Kalau dioper apa adanya, yang
| terbaca adalah daftar centangan saat komponennya dipasang — selalu
| kosong, jadi setiap penekanan berarti "seluruh baris yang terlihat"
| walau ada yang dicentang.
*/
const collection = useCrudCollectionActions(crud, {
  actions: accountingEventsCollectionActions,
  selectedIds: () => selectedIds.value,
  notify,
})

function onSelectionChange(
  value: { ids: string[], rows: any[] },
) {
  selectedIds.value = value.ids
}

async function openImport() {
  await router.push("/finance/accounting-events/import")
}

function askBulkDelete() {
  bulk.ask(selectedIds.value)
}

async function confirmBulkDelete() {
  await bulk.confirm()

  selectedIds.value = []
}

const deleteTitle = computed(() => {
  const label =
    (accountingEventsConfig as Record<string, any>).label
    ?? (accountingEventsConfig as Record<string, any>).title
    ?? accountingEventsConfig.id
    ?? "AccountingEvents"

  return `Delete ${String(label)}`
})

function resolveEditPath(
  row: AccountingEventsRow,
) {
  if (props.editPath)
    return props.editPath(row)

  if (row.id == null)
    return null

  return `/finance/accounting-events/${row.id}/edit`
}

async function openCreate() {
  emit("create")

  if (!props.autoNavigate)
    return

  await router.push(
    props.createPath,
  )
}

async function openEdit(
  row: AccountingEventsRow,
) {
  emit("edit", row)

  if (!props.autoNavigate)
    return

  const targetPath =
    resolveEditPath(row)

  if (!targetPath)
    return

  await router.push(
    targetPath,
  )
}

async function selectRow(
  row: AccountingEventsRow,
) {
  emit("select", row)

  if (!props.autoNavigate)
    return

  await openEdit(row)
}

async function confirmDelete() {
  const selected =
    remove.selected.value ?? null

  await remove.confirm()

  emit("deleted", selected)
}

async function refresh() {
  await crud.refresh()
}

const columns = computed(() =>
  getAccountingEventsColumns({
    onEdit: crud.ui.value.edit
      ? openEdit
      : undefined,

    onDelete: crud.ui.value.delete
      ? remove.ask
      : undefined,
  }),
)

defineExpose({
  crud,
  refresh,
})
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
      :filters-schema="accountingEventsFilters"
      :show-add="crud.ui.value.create"
      :show-import="crud.ui.value.import"
      :show-export="crud.ui.value.export"
      :show-bulk-delete="crud.ui.value.bulk_delete"
      :show-template="crud.ui.value.import"
      :collection-actions="collection.available.value"
      :selected-count="selectedIds.length"
      :running-action="collection.running.value"
      @update:search="crud.onSearch"
      @apply-filters="crud.onApply"
      @reset-filters="crud.onReset"
      @change-page="crud.onChangePage"
      @change-page-size="crud.onChangePageSize"
      @change-sorting="crud.onSort"
      @row-click="selectRow"
      @add="openCreate"
      @import="openImport"
      @export="exporter.exportData"
      @template="exporter.downloadTemplate"
      @bulk-delete="askBulkDelete"
      @selection-change="onSelectionChange"
      @collection-action="collection.ask"
    />

    <MCrudDelete
      v-if="crud.ui.value.delete"
      v-model:open="remove.open.value"
      :title="deleteTitle"
      description="Are you sure you want to delete this record?"
      @confirm="confirmDelete"
    />

    <MCrudDelete
      v-if="crud.ui.value.bulk_delete"
      v-model:open="bulk.open.value"
      :title="`Delete ${bulk.ids.value.length} record(s)`"
      description="Are you sure you want to delete all selected records?"
      @confirm="confirmBulkDelete"
    />

    <MCrudConfirm
      v-if="collection.available.value.length"
      v-model:open="collection.open.value"
      :title="collection.confirmTitle.value"
      :description="collection.confirmDescription.value"
      :confirm-label="collection.confirmLabel.value"
      :variant="collection.confirmVariant.value"
      :loading="!!collection.running.value"
      @confirm="collection.confirm"
    />
  </div>
</template>