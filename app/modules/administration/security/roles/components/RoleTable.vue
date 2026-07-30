<script setup lang="ts">
import { computed } from "vue"

import { useNotify } from "@/composables/useNotify"
import { useAuthStore } from "@/stores/auth"

import { useCrud, useCrudDialog, useCrudDelete } from "@framework"

import { MCrudTable } from "@framework"
import MCrudDelete from "@framework/components/crud/MCrudDelete.vue"

import RoleDialog, {
  type RolePayload,
} from "@/modules/administration/security/roles/components/RoleDialog.vue"

import {
  getRoleColumns,
  type RoleRow,
} from "@/modules/administration/security/roles/columns"

import { roleConfig } from "@/modules/administration/security/roles/table"
import { roleFilters } from "@/modules/administration/security/roles/filters"

const notify = useNotify()
const auth = useAuthStore()

const role = computed(() => (auth.user?.role ?? "SITE_USER") as any)

const crud = useCrud<RoleRow>({
  ...roleConfig,
  name: "security-roles",
})

const dialog = useCrudDialog<RoleRow>(crud, {
  entity: "Role",
  notify,
  getLabel: (row) => row.name,
})

const del = useCrudDelete<RoleRow>(crud, {
  entity: "Role",
  notify,
  getLabel: (row) => row.name,
})

const columns = computed(() =>
  getRoleColumns(
    {
      onEdit: dialog.openEdit,
      onDelete: del.ask,
    },
    { role: role.value },
  ),
)

function submit(payload: RolePayload) {
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
      :filters-schema="roleFilters"
      :show-add="true"
      :show-import="false"
      :show-export="false"
      :show-bulk-delete="false"
      @update:search="crud.onSearch"
      @apply-filters="crud.onApply"
      @reset-filters="crud.onReset"
      @change-page="crud.onChangePage"
      @change-page-size="crud.onChangePageSize"
      @change-sorting="crud.onSort"
      @add="dialog.openCreate"
    />

    <RoleDialog
      v-model:open="dialog.open.value"
      :mode="dialog.mode.value"
      :role="role"
      :initial="dialog.selected.value"
      :loading="dialog.loading.value"
      :errors="dialog.errors.value || undefined"
      @submit="submit"
    />

    <MCrudDelete
      v-model:open="del.open.value"
      title="Delete Role"
      :description="`Are you sure you want to delete '${del.selected.value?.name}'?`"
      @confirm="del.confirm"
    />
  </div>
</template>