<script setup lang="ts">
import { computed } from "vue"

import { useNotify } from "@/composables/useNotify"
import { useAuthStore } from "@/stores/auth"

import {
  MCrudDelete,
  MCrudTable,
  useCrud,
  useCrudDelete,
  useCrudDialog,
} from "@framework"

import PermissionDialog, {
  type PermissionPayload,
} from "@/modules/administration/security/permissions/components/PermissionDialog.vue"

import {
  getPermissionColumns,
  type PermissionRow,
} from "@/modules/administration/security/permissions/columns"

import { permissionConfig } from "@/modules/administration/security/permissions/table"
import { permissionFilters } from "@/modules/administration/security/permissions/filters"

const notify = useNotify()
const auth = useAuthStore()

const role = computed(() => (auth.user?.role ?? "SITE_USER") as any)

const crud = useCrud<PermissionRow>({
  ...permissionConfig,
  name: "security-permissions",
})

const dialog = useCrudDialog<PermissionRow>(crud, {
  entity: "Permission",
  notify,
  getLabel: row => row.name,
})

const del = useCrudDelete<PermissionRow>(crud, {
  entity: "Permission",
  notify,
  getLabel: row => row.name,
})

function remove() {
  notify.info("Django permissions should not be deleted manually")
}

const columns = computed(() =>
  getPermissionColumns(
    {
      onEdit: dialog.openEdit,
      onDelete: remove,
    },
    { role: role.value },
  ),
)

function submit(payload: PermissionPayload) {
  dialog.submit(payload)
}
</script>

<template>
  <div class="flex w-full flex-col items-stretch gap-4">
    <MCrudTable
      :columns="columns"
      :data="crud.rows.value"
      :total="crud.total.value"
      :page="crud.page.value"
      :page-size="crud.pageSize.value"
      :search="crud.search.value"
      :loading="crud.pending.value"
      :filters-schema="permissionFilters"
      :show-add="false"
      :show-import="false"
      :show-export="false"
      :show-bulk-delete="false"
      @update:search="crud.onSearch"
      @apply-filters="crud.onApply"
      @reset-filters="crud.onReset"
      @change-page="crud.onChangePage"
      @change-page-size="crud.onChangePageSize"
      @change-sorting="crud.onSort"
    />

    <PermissionDialog
      v-model:open="dialog.open.value"
      :initial="dialog.selected.value"
      :role="role"
      :loading="dialog.loading.value"
      :errors="dialog.errors.value || undefined"
      @submit="submit"
    />

    <MCrudDelete
      v-model:open="del.open.value"
      title="Delete Permission"
      description="Django permissions should not be deleted manually."
    />
  </div>
</template>