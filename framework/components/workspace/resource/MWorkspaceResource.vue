<script
  setup
  lang="ts"
  generic="
    TRow extends { id: string | number },
    TPayload extends Record<string, any>
  "
>
import {
  computed,
  h,
} from "vue"

import {
  MCrudActions,
} from "@framework"

import type {
  ColumnDef,
} from "@tanstack/vue-table"

import type {
  FormField,
} from "../../../builders/forms/types"

import { translate } from "../../../core/utils/i18n"

import MWorkspaceResourceDialog from "./MWorkspaceResourceDialog.vue"
import MWorkspaceResourceTable from "./MWorkspaceResourceTable.vue"

type ResourceSort = {
  key: string | null
  dir: "asc" | "desc" | null
}

const props = withDefaults(
  defineProps<{
    title: string
    description?: string

    rows?: TRow[]
    columns: ColumnDef<TRow, any>[]
    schema?: FormField[]

    total?: number
    page?: number
    pageSize?: number
    search?: string

    loading?: boolean
    saving?: boolean
    deleting?: boolean

    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean

    dialogOpen?: boolean
    deleteOpen?: boolean
    mode?: "create" | "edit"
    selected?: TRow | null
    errors?: Record<string, any> | null

    addLabel?: string
    emptyText?: string
  }>(),
  {
    description: "",
    rows: () => [] as TRow[],
    schema: () => [] as FormField[],
    total: 0,
    page: 1,
    pageSize: 10,
    search: "",
    loading: false,
    saving: false,
    deleting: false,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    dialogOpen: false,
    deleteOpen: false,
    mode: "create",
    selected: null,
    errors: null,
    addLabel: "Add",
    emptyText: "No records found.",
  },
)

const emit = defineEmits<{
  add: []
  edit: [row: TRow]
  delete: [row: TRow]
  submit: [payload: TPayload]
  confirmDelete: []

  "update:dialogOpen": [value: boolean]
  "update:deleteOpen": [value: boolean]
  "update:search": [value: string]

  changePage: [value: number]
  changePageSize: [value: number]
  changeSorting: [value: ResourceSort]
}>()

const resourceColumns = computed<
  ColumnDef<TRow, any>[]
>(() => {
  const columns: ColumnDef<
    TRow,
    any
  >[] = [
    ...props.columns,
  ]

  const hasActions =
    props.canEdit
    || props.canDelete

  if (!hasActions)
    return columns

  columns.push({
    id: "actions",

    header: () =>
      h(
        "div",
        {
          class: "text-left",
        },
        translate("common.actions.actions", "Actions"),
      ),

    enableSorting: false,
    enableHiding: false,

    cell: ({ row }) =>
      h(
        "div",
        {
          class:
            "flex justify-end",
          onClick: (
            event: MouseEvent,
          ) => {
            event.stopPropagation()
          },
        },
        [
          h(MCrudActions, {
            row: row.original,

            onEdit: props.canEdit
              ? () => {
                  emit(
                    "edit",
                    row.original,
                  )
                }
              : undefined,

            onDelete: props.canDelete
              ? () => {
                  emit(
                    "delete",
                    row.original,
                  )
                }
              : undefined,
          }),
        ],
      ),
  })

  return columns
})
function handleRowClick(
  row: TRow,
) {
  if (!props.canEdit)
    return

  emit("edit", row)
}

function handleSearch(
  value: string,
) {
  emit("update:search", value)
}

function handleChangePage(
  value: number,
) {
  emit("changePage", value)
}

function handleChangePageSize(
  value: number,
) {
  emit("changePageSize", value)
}

function handleChangeSorting(
  value: ResourceSort,
) {
  emit("changeSorting", value)
}

function handleDialogOpen(
  value: boolean,
) {
  emit("update:dialogOpen", value)
}

function handleDeleteOpen(
  value: boolean,
) {
  emit("update:deleteOpen", value)
}

function handleConfirmDelete() {
  emit("confirmDelete")
}

function handleSubmit(
  payload: Record<string, any>,
) {
  emit("submit", payload as TPayload)
}
</script>

<template>
  <Card>
    <CardHeader
      class="
        flex flex-row items-start
        justify-between gap-4
      "
    >
      <div>
        <CardTitle>
          {{ props.title }}
        </CardTitle>

        <CardDescription
          v-if="props.description"
        >
          {{ props.description }}
        </CardDescription>
      </div>

      <!-- <Button
        v-if="props.canCreate"
        type="button"
        size="sm"
        :disabled="props.loading || props.saving"
        @click="emit('add')"
      >
        {{ props.addLabel }}
      </Button> -->
    </CardHeader>

    <CardContent>
      <MWorkspaceResourceTable
        :columns="resourceColumns"
        :rows="props.rows"
        :total="props.total"
        :page="props.page"
        :page-size="props.pageSize"
        :search="props.search"
        :loading="props.loading"
        :show-add="props.canCreate"
        :add-label="props.addLabel"
        :empty-text="props.emptyText"
        @add="emit('add')"
        @row-click="handleRowClick"
        @update:search="handleSearch"
        @change-page="handleChangePage"
        @change-page-size="handleChangePageSize"
        @change-sorting="handleChangeSorting"
      />
    </CardContent>

    <MWorkspaceResourceDialog
      :open="props.dialogOpen"
      :mode="props.mode"
      :schema="props.schema"
      :initial="props.selected"
      :loading="props.saving"
      :errors="props.errors"
      :title="
        props.mode === 'create'
          ? `Add ${props.title}`
          : `Edit ${props.title}`
      "
      @update:open="handleDialogOpen"
      @submit="handleSubmit"
    />

    <MCrudDelete
      v-if="props.canDelete"
      :open="props.deleteOpen"
      :loading="props.deleting"
      :title="`Delete ${props.title}`"
      description="Are you sure you want to delete this record?"
      @update:open="handleDeleteOpen"
      @confirm="handleConfirmDelete"
    />
  </Card>
</template>