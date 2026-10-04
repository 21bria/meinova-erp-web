<script
  setup
  lang="ts"
  generic="
    TRow extends { id: string | number },
    TPayload extends Record<string, any>
  "
>
import type {
  ColumnDef,
} from "@tanstack/vue-table"

import type {
  FormField,
} from "@framework"

import {
  MWorkspaceResource,
  useWorkspaceResource,
} from "@framework"

const props = defineProps<{
  title: string
  endpoint: string

  parentField: string
  parentId?: number | string | null

  columns: ColumnDef<TRow, any>[]
  schema: FormField[]
}>()

const resource = useWorkspaceResource<
  TRow,
  TPayload
>({
  endpoint: () => props.endpoint,
  parentKey: props.parentField,
  parentId: () => props.parentId,
  immediate: true,
})

function updateDialogOpen(
  value: boolean,
) {
  if (value) {
    resource.dialogOpen.value = true
    return
  }

  resource.closeDialog()
}

function updateDeleteOpen(
  value: boolean,
) {
  resource.deleteOpen.value = value
}

function handleSubmit(
  payload: Record<string, any>,
) {
  return resource.submit(
    payload as TPayload,
  )
}
</script>

<template>
  <MWorkspaceResource
    :title="title"
    :rows="resource.rows.value"
    :columns="columns"
    :schema="schema"
    :total="resource.total.value"
    :page="resource.page.value"
    :page-size="resource.pageSize.value"
    :search="resource.search.value"
    :loading="resource.pending.value"
    :saving="resource.saving.value"
    :deleting="resource.deleting.value"
    :can-create="resource.canCreate.value"
    :dialog-open="resource.dialogOpen.value"
    :delete-open="resource.deleteOpen.value"
    :mode="resource.mode.value"
    :selected="resource.selected.value"
    :errors="resource.errors.value"
    @add="resource.openCreate"
    @edit="resource.openEdit"
    @delete="resource.askDelete"
    @submit="handleSubmit"
    @confirm-delete="resource.confirmDelete"
    @update:dialog-open="updateDialogOpen"
    @update:delete-open="updateDeleteOpen"
    @update:search="resource.onSearch"
    @change-page="resource.onChangePage"
    @change-page-size="resource.onChangePageSize"
    @change-sorting="resource.onChangeSorting"
  />
</template>