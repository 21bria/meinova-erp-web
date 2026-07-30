<script setup lang="ts">
import { computed } from "vue"

import {
  MCrudDelete,
  MCrudTable,
  useCrud,
  useCrudDelete,
} from "@framework"

import { getEmployeesColumns } from "../columns"
import { employeesFilters } from "../filters"
import { employeesConfig } from "../table"

import type {
  EmployeesRow,
} from "../types"

const emit = defineEmits<{
  select: [row: EmployeesRow]
}>()

const router = useRouter()

const crud = useCrud<EmployeesRow>({
  ...employeesConfig,
  name: employeesConfig.id,
})

const remove = useCrudDelete<EmployeesRow>(crud)

function openCreate() {
  router.push("/hr/employees/create")
}

function openEdit(row: EmployeesRow) {
  if (row.id == null)
    return

  router.push(`/hr/employees/${row.id}/edit`)
}

function selectRow(row: EmployeesRow) {
  emit("select", row)
}

const columns = computed(() =>
  getEmployeesColumns({
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
      :filters-schema="employeesFilters"
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
      @row-click="selectRow"
      @add="openCreate"
    />

    <MCrudDelete
      v-if="crud.ui.value.delete"
      v-model:open="remove.open.value"
      :title="`Delete ${employeesConfig.id}`"
      description="Are you sure you want to delete this record?"
      @confirm="remove.confirm"
    />
  </div>
</template>