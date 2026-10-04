<script setup lang="ts">
/**
 * Pager server-side untuk layar workflow.
 *
 * Halaman dan ukuran halaman dikirim ke API (`?page=&page_size=`) dan
 * jumlah totalnya dibaca dari `meta.count` — **bukan** memuat semua
 * baris lalu memotongnya di browser. Kotak masuk approver yang lama
 * berjalan bisa berisi ratusan baris, dan tenant dengan ribuan dokumen
 * akan menghabiskan memori browser sebelum barisnya sempat tampil.
 *
 * `page_size` dibatasi backend di 100 (`MAX_PAGE_SIZE`), jadi pilihan
 * di sini tidak boleh melebihinya — nilai yang lebih besar diam-diam
 * dipotong dan halamannya jadi tidak konsisten dengan total.
 *
 * Tampilannya menumpang `MPagination`, pager bersama ERP, supaya layar
 * workflow ikut mendapat tata letak responsifnya. Yang tersisa di sini
 * cuma bentuk prop khas workflow (`count`/`disabled`) dan reset halaman
 * saat ukuran berubah.
 */
import { MPagination } from '@framework'

defineProps<{
  page: number
  pageSize: number
  count: number
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:page': [value: number]
  'update:pageSize': [value: number]
}>()

const PAGE_SIZES = [10, 20, 50, 100]

function changeSize(size: number) {
  emit('update:pageSize', size)

  // Ukuran halaman berubah berarti nomor halaman lama bisa melebihi
  // total yang baru — dan halaman di luar jangkauan membalas daftar
  // kosong yang terlihat seperti "datanya hilang".
  emit('update:page', 1)
}
</script>

<template>
  <MPagination
    :page="page"
    :page-size="pageSize"
    :total="count"
    :loading="disabled"
    :page-size-options="PAGE_SIZES"
    @update:page="(value) => emit('update:page', value)"
    @update:page-size="changeSize"
  />
</template>
