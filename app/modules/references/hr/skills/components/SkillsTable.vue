<script setup lang="ts">
import { computed } from "vue"

import {
  MCrudDelete,
  MCrudTable,
  useCrud,
  useCrudDelete,
  useCrudDialog,
} from "@framework"

import SkillsDialog from "./SkillsDialog.vue"

import { getSkillsColumns } from "../columns"
import { skillsFilters } from "../filters"
import { skillsConfig } from "../table"

import type {
  SkillsPayload,
  SkillsRow,
} from "../types"

const crud = useCrud<SkillsRow>({
  ...skillsConfig,
  name: skillsConfig.id,
})

const dialog = useCrudDialog<SkillsRow>(crud)
const remove = useCrudDelete<SkillsRow>(crud)

const columns = computed(() =>
  getSkillsColumns(
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
      :filters-schema="skillsFilters"
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

    <SkillsDialog
      v-if="crud.ui.value.create || crud.ui.value.edit"
      v-model:open="dialog.open.value"
      :mode="dialog.mode.value"
      :initial="dialog.selected.value"
      :loading="dialog.loading.value"
      :errors="dialog.errors.value || undefined"
      @submit="(payload: SkillsPayload) => dialog.submit(payload)"
    />

    <MCrudDelete
      v-if="crud.ui.value.delete"
      v-model:open="remove.open.value"
      :title="`Delete ${skillsConfig.id}`"
      :description="`Are you sure you want to delete this record?`"
      @confirm="remove.confirm"
    />
  </div>
</template>