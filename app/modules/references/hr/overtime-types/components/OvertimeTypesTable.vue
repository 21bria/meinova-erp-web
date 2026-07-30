<script setup lang="ts">
import { computed } from "vue"

import {
  MCrudDelete,
  MCrudTable,
  useCrud,
  useCrudDelete,
  useCrudDialog,
} from "@framework"

import OvertimeTypesDialog from "./OvertimeTypesDialog.vue"

import { getOvertimeTypesColumns } from "../columns"
import { overtimeTypesFilters } from "../filters"
import { overtimeTypesConfig } from "../table"

import type {
  OvertimeTypesPayload,
  OvertimeTypesRow,
} from "../types"

const crud = useCrud<OvertimeTypesRow>({
  ...overtimeTypesConfig,
  name: overtimeTypesConfig.id,
})

const dialog = useCrudDialog<OvertimeTypesRow>(crud)
const remove = useCrudDelete<OvertimeTypesRow>(crud)

const columns = computed(() =>
  getOvertimeTypesColumns(
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
      :filters-schema="overtimeTypesFilters"
      :show-add="crud.ui.value.create"
      :show-import="crud.ui.value.import"
      :show-export="crud.ui.value.export"
      :show-bulk-delete="crud.ui.value.bulk_delete"
      @update:search="crud.onSearch"
      @apply-filters="crud.onApply"
      @reset-filters="crud.onReset"
      @change-page="crud.onChangePage"
      @change-page-size="crud.onChangePageSize"
      @change-sorting="crud.onSort"
      @add="dialog.openCreate"
    />

    <OvertimeTypesDialog
      v-if="crud.ui.value.create || crud.ui.value.edit"
      v-model:open="dialog.open.value"
      :mode="dialog.mode.value"
      :initial="dialog.selected.value"
      :loading="dialog.loading.value"
      :errors="dialog.errors.value || undefined"
      @submit="(payload: OvertimeTypesPayload) => dialog.submit(payload)"
    />

    <MCrudDelete
      v-if="crud.ui.value.delete"
      v-model:open="remove.open.value"
      :title="`Delete ${overtimeTypesConfig.id}`"
      :description="`Are you sure you want to delete this record?`"
      @confirm="remove.confirm"
    />
  </div>
</template>