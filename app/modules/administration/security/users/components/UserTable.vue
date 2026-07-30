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

import UserDialog, {
  type UserPayload,
} from "@/modules/administration/security/users/components/UserDialog.vue"

import {
  getUserColumns,
  type UserRow,
} from "@/modules/administration/security/users/columns"

import { userConfig } from "@/modules/administration/security/users/table"
import { userFilters } from "@/modules/administration/security/users/filters"

const notify = useNotify()
const auth = useAuthStore()

const role = computed(() => (auth.user?.role ?? "SITE_USER") as any)

const crud = useCrud<UserRow>({
  ...userConfig,
  name: "security-users",
})

const dialog = useCrudDialog<UserRow>(crud, {
  entity: "User",
  notify,
  getLabel: row => row.username,
})

const del = useCrudDelete<UserRow>(crud, {
  entity: "User",
  notify,
  getLabel: row => row.username,
})

const columns = computed(() =>
  getUserColumns(
    {
      onEdit: dialog.openEdit,
      onDelete: del.ask,
    },
    { role: role.value },
  ),
)

function submit(payload: UserPayload) {
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
      :filters-schema="userFilters"
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

    <UserDialog
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
      title="Delete User"
      :description="`Are you sure you want to delete '${del.selected.value?.username}'?`"
      @confirm="del.confirm"
    />
  </div>
</template>