<script setup lang="ts">
import { computed } from 'vue'
import { MCrudTable, useCrud } from '@framework'
import { getSessionColumns } from '../columns'
import { sessionConfig } from '../table'
import type { SessionRow } from '../types'

const crud = useCrud<SessionRow>({
  ...sessionConfig,
  name: sessionConfig.id,
})

const columns = computed(() =>
  getSessionColumns({
    onEdit: () => {},
    onDelete: () => {},
  }),
)
</script>

<template>
  <MCrudTable
    :columns="columns"
    :data="crud.rows.value"
    :total="crud.total.value"
    :page="crud.page.value"
    :page-size="crud.pageSize.value"
    :search="crud.search.value"
    :loading="crud.pending.value"
    :show-add="false"
    :show-import="false"
    :show-export="false"
    :show-bulk-delete="false"
    @update:search="crud.onSearch"
    @change-page="crud.onChangePage"
    @change-page-size="crud.onChangePageSize"
    @change-sorting="crud.onSort"
  />
</template>
