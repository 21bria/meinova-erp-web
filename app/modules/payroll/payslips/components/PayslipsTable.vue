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
  useCrudDialog,
  useCrudExport,
} from "@framework"

import PayslipsDialog from "./PayslipsDialog.vue"

import { payslipsCollectionActions } from "../actions"
import { getPayslipsColumns } from "../columns"
import { payslipsFilters } from "../filters"
import { payslipsConfig } from "../table"

import type {
  PayslipsPayload,
  PayslipsRow,
} from "../types"

const router = useRouter()

const crud = useCrud<PayslipsRow>({
  ...payslipsConfig,
  name: payslipsConfig.id,
})

const dialog = useCrudDialog<PayslipsRow>(crud)
const remove = useCrudDelete<PayslipsRow>(crud)

const notify = useNotify()

/*
|--------------------------------------------------------------------------
| Import / Export / Bulk delete
|--------------------------------------------------------------------------
|
| Tombolnya sudah lama dirender lewat `crud.ui`, tapi handler-nya tidak
| pernah ikut digenerate untuk editor berdialog — jadi Import, Export,
| dan Bulk Delete tampil, ditekan, dan tidak terjadi apa-apa. Endpoint
| import bersifat generik per module di backend, jadi bisa diturunkan
| langsung dari path module ini.
|
*/

const selectedIds = ref<string[]>([])

const bulk = useCrudBulkDelete(crud, {
  entity: "payslips",
  notify,
})

const exporter = useCrudExport({
  endpoint: `${payslipsConfig.endpoint}export/`,
  templateEndpoint: "/api/imports/payroll/payslips/template/",
  filename: "payslips-export.csv",
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
| membacanya tepat saat tombolnya ditekan. Kalau dioper apa adanya,
| yang terbaca adalah daftar centangan saat komponennya dipasang —
| selalu kosong, jadi setiap penekanan berarti "seluruh baris yang
| terlihat" walau ada yang dicentang.
*/
const collection = useCrudCollectionActions(crud, {
  actions: payslipsCollectionActions,
  selectedIds: () => selectedIds.value,
  notify,
})

function onSelectionChange(
  value: { ids: string[], rows: any[] },
) {
  selectedIds.value = value.ids
}

async function openImport() {
  await router.push("/payroll/payslips/import")
}

function askBulkDelete() {
  bulk.ask(selectedIds.value)
}

async function confirmBulkDelete() {
  await bulk.confirm()

  selectedIds.value = []
}

const columns = computed(() =>
  getPayslipsColumns(
    {
      onEdit: crud.ui.value.edit
        ? dialog.openEdit
        : undefined,

      onDelete: crud.ui.value.delete
        ? remove.ask
        : undefined,
    },
  ),
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
      :filters-schema="payslipsFilters"
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
      @add="dialog.openCreate"
      @import="openImport"
      @export="exporter.exportData"
      @template="exporter.downloadTemplate"
      @bulk-delete="askBulkDelete"
      @selection-change="onSelectionChange"
      @collection-action="collection.ask"
    />

    <PayslipsDialog
      v-if="crud.ui.value.create || crud.ui.value.edit"
      v-model:open="dialog.open.value"
      :mode="dialog.mode.value"
      :initial="dialog.selected.value"
      :loading="dialog.loading.value"
      :errors="dialog.errors.value || undefined"
      @submit="(payload: PayslipsPayload) => dialog.submit(payload)"
      @refresh="crud.refresh"
    />

    <MCrudDelete
      v-if="crud.ui.value.delete"
      v-model:open="remove.open.value"
      :title="`Delete ${payslipsConfig.id}`"
      :description="`Are you sure you want to delete this record?`"
      @confirm="remove.confirm"
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
