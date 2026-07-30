<script setup lang="ts">
import { computed } from "vue"

import {
  MCrudDelete,
  MCrudTable,
  useCrud,
  useCrudDelete,
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
      @update:search="crud.onSearch"
      @apply-filters="crud.onApply"
      @reset-filters="crud.onReset"
      @change-page="crud.onChangePage"
      @change-page-size="crud.onChangePageSize"
      @change-sorting="crud.onSort"
      @add="openCreate"
    />

    <MCrudDelete
      v-if="crud.ui.value.delete"
      v-model:open="remove.open.value"
      :title="`Delete ${__name__Config.id}`"
      description="Are you sure you want to delete this record?"
      @confirm="remove.confirm"
    />
  </div>
</template>