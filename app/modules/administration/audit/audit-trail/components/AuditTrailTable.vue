<script setup lang="ts">
import { computed } from "vue"

import {
  MCrudDelete,
  MCrudTable,
  useCrud,
  useCrudDelete,
  useCrudDialog,
} from "@framework"

import AuditTrailDialog from "./AuditTrailDialog.vue"

import { getAuditTrailColumns } from "../columns"
import { auditTrailFilters } from "../filters"
import { auditTrailConfig } from "../table"

import type {
  AuditTrailPayload,
  AuditTrailRow,
} from "../types"

const crud = useCrud<AuditTrailRow>({
  ...auditTrailConfig,
  name: auditTrailConfig.id,
})

const dialog = useCrudDialog<AuditTrailRow>(crud)
const remove = useCrudDelete<AuditTrailRow>(crud)

const columns = computed(() =>
  getAuditTrailColumns(
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
      :filters-schema="auditTrailFilters"
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

    <AuditTrailDialog
      v-if="crud.ui.value.create || crud.ui.value.edit"
      v-model:open="dialog.open.value"
      :mode="dialog.mode.value"
      :initial="dialog.selected.value"
      :loading="dialog.loading.value"
      :errors="dialog.errors.value || undefined"
      @submit="(payload: AuditTrailPayload) => dialog.submit(payload)"
    />

    <MCrudDelete
      v-if="crud.ui.value.delete"
      v-model:open="remove.open.value"
      :title="`Delete ${auditTrailConfig.id}`"
      :description="`Are you sure you want to delete this record?`"
      @confirm="remove.confirm"
    />
  </div>
</template>