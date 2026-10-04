<script setup lang="ts">
/**
 * Kaki paginasi `DataTableMaster`.
 *
 * Isinya `MPagination`, pager bersama ERP — yang tersisa di sini hanya
 * pembatas atas milik kartu tabelnya dan reset halaman saat ukuran
 * halaman berubah (halaman di luar jangkauan membalas daftar kosong).
 */
import { MPagination } from '@framework'

defineProps<{
  page: number // 1-based
  pageSize: number
  total: number
  loading?: boolean
  pageSizeOptions?: number[]
}>()

const emit = defineEmits<{
  (e: 'update:page', v: number): void
  (e: 'update:pageSize', v: number): void
}>()

function setPageSize(value: number) {
  emit('update:pageSize', value)
  emit('update:page', 1)
}
</script>

<template>
  <div class="border-t px-3 py-2">
    <MPagination
      :page="page"
      :page-size="pageSize"
      :total="total"
      :loading="loading"
      :page-size-options="pageSizeOptions ?? [10, 20, 30, 40, 50]"
      @update:page="(value) => emit('update:page', value)"
      @update:page-size="setPageSize"
    />
  </div>
</template>
