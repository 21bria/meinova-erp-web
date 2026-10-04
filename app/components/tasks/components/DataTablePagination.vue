<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { Task } from '../data/schema'
import { MPagination } from '@framework'

/**
 * Kaki paginasi tabel tugas.
 *
 * Paginasinya milik TanStack (client-side), tapi tampilannya memakai
 * `MPagination` yang sama dengan tabel lain supaya perilaku responsif
 * ERP cuma hidup di satu tempat. Ringkasan di kiri diganti lewat slot
 * karena layar ini menghitung baris terpilih, bukan rentang baris.
 */
interface DataTablePaginationProps {
  table: Table<Task>
}
const props = defineProps<DataTablePaginationProps>()

const total = computed(() => props.table.getFilteredRowModel().rows.length)
const selected = computed(() => props.table.getFilteredSelectedRowModel().rows.length)
const page = computed(() => props.table.getState().pagination.pageIndex + 1)
const pageSize = computed(() => props.table.getState().pagination.pageSize)

function setPage(value: number) {
  props.table.setPageIndex(value - 1)
}

function setPageSize(value: number) {
  props.table.setPageSize(value)

  // Ukuran baru bisa membuat halaman lama di luar jangkauan, dan
  // halaman di luar jangkauan merender tabel kosong.
  props.table.setPageIndex(0)
}
</script>

<template>
  <div class="px-2">
    <MPagination
      :page="page"
      :page-size="pageSize"
      :total="total"
      :page-size-options="[10, 20, 30, 40, 50]"
      @update:page="setPage"
      @update:page-size="setPageSize"
    >
      <template #summary>
        {{ selected }} of {{ total }} row(s) selected.
      </template>
    </MPagination>
  </div>
</template>
