<script setup lang="ts">
/**
 * Pager bersama untuk seluruh ERP.
 *
 * Satu komponen ini dipakai tabel CRUD, tabel dashboard, dan layar
 * workflow lewat pembungkus tipis — jadi perilaku responsifnya cukup
 * diperbaiki sekali di sini, bukan per halaman.
 *
 * Bentuknya dua baris di layar sempit (ringkasan di atas, kontrol di
 * bawah) dan satu baris mulai `sm`. Tombol First/Last disembunyikan di
 * mobile karena Prev/Next sudah cukup untuk navigasi selangkah, dan
 * empat tombol + selektor + info halaman tidak muat di 320px tanpa
 * memotong tombol terakhir keluar dari kartu.
 *
 * Komponen ini TIDAK mereset nomor halaman saat ukuran halaman berubah.
 * Pemanggilnya yang memegang state (`useCrud`, layar workflow) sudah
 * melakukannya, dan mereset di dua tempat berarti dua permintaan.
 */
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-vue-next"

import { computed } from "vue"

import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const props = withDefaults(
  defineProps<{
    page: number
    pageSize: number
    total: number
    loading?: boolean
    pageSizeOptions?: number[]
  }>(),
  {
    loading: false,
    pageSizeOptions: () => [10, 25, 50, 100],
  },
)

const emit = defineEmits<{
  "update:page": [value: number]
  "update:pageSize": [value: number]
}>()

/*
|--------------------------------------------------------------------------
| Safe pagination values
|--------------------------------------------------------------------------
*/

const safePageSize = computed(() => {
  const value = Number(props.pageSize)

  if (Number.isFinite(value) && value > 0)
    return value

  return 10
})

const safeTotal = computed(() => {
  const value = Number(props.total)

  if (Number.isFinite(value) && value >= 0)
    return value

  return 0
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(safeTotal.value / safePageSize.value))
})

const safePage = computed(() => {
  const value = Number(props.page)

  if (!Number.isFinite(value) || value < 1)
    return 1

  return Math.min(value, totalPages.value)
})

const from = computed(() => {
  if (safeTotal.value === 0)
    return 0

  return ((safePage.value - 1) * safePageSize.value) + 1
})

const to = computed(() => {
  return Math.min(safePage.value * safePageSize.value, safeTotal.value)
})

const canPrevious = computed(() => !props.loading && safePage.value > 1)
const canNext = computed(() => !props.loading && safePage.value < totalPages.value)

/*
 * Pilihan yang dikirim pemanggil belum tentu memuat ukuran yang sedang
 * dipakai — halaman workflow mengirim 20 sementara default framework
 * tidak punya 20. Tanpa penambalan ini selektornya tampil kosong.
 */
const sizeOptions = computed(() => {
  const options = (props.pageSizeOptions ?? [])
    .map(option => Number(option))
    .filter(option => Number.isFinite(option) && option > 0)

  if (!options.includes(safePageSize.value))
    options.push(safePageSize.value)

  return [...new Set(options)].sort((a, b) => a - b)
})

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

function changePage(value: number) {
  const nextPage = Math.min(Math.max(value, 1), totalPages.value)

  if (nextPage !== safePage.value)
    emit("update:page", nextPage)
}

function changePageSize(value: unknown) {
  const size = Number(value)

  if (!Number.isFinite(size) || size <= 0 || size === safePageSize.value)
    return

  emit("update:pageSize", size)
}
</script>

<template>
  <div
    class="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
  >
    <!--
      Ringkasan boleh melipat di layar sempit; `min-w-0` mencegahnya
      mendorong kontrol keluar dari kartu.
    -->
    <p class="min-w-0 text-sm text-muted-foreground">
      <slot
        name="summary"
        :from="from"
        :to="to"
        :total="safeTotal"
      >
        {{ $t('common.pagination.showing', { from, to, total: safeTotal }) }}
      </slot>
    </p>

    <div
      class="flex min-w-0 items-center justify-between gap-2 sm:justify-end sm:gap-3"
    >
      <Select
        :model-value="String(safePageSize)"
        :disabled="loading"
        @update:model-value="changePageSize"
      >
        <SelectTrigger
          class="h-9 w-auto min-w-0 shrink-0"
          :aria-label="$t('common.pagination.rowsPerPage')"
        >
          <!--
            Label ditulis eksplisit, bukan mengandalkan nilai terpilih:
            `SelectValue` baru terisi setelah hidrasi, dan selektor yang
            kosong pada gambar pertama membuat lebar kakinya melompat.
          -->
          <SelectValue>
            {{ $t('common.pagination.perPage', { size: safePageSize }) }}
          </SelectValue>
        </SelectTrigger>

        <SelectContent side="top">
          <SelectItem
            v-for="option in sizeOptions"
            :key="option"
            :value="String(option)"
          >
            {{ $t('common.pagination.perPage', { size: option }) }}
          </SelectItem>
        </SelectContent>
      </Select>

      <span class="shrink-0 whitespace-nowrap text-sm text-muted-foreground tabular-nums">
        <span class="hidden sm:inline">
          {{ $t('common.pagination.page', { page: safePage, total: totalPages }) }}
        </span>

        <span class="sm:hidden">
          {{ safePage }} / {{ totalPages }}
        </span>
      </span>

      <div class="flex shrink-0 items-center gap-1 sm:gap-2">
        <!-- First/Last hanya muncul mulai `sm`; lihat catatan di atas. -->
        <Button
          variant="outline"
          size="icon"
          class="hidden size-9 sm:inline-flex"
          :disabled="!canPrevious"
          :aria-label="$t('common.pagination.first')"
          @click="changePage(1)"
        >
          <ChevronsLeft class="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          class="size-9"
          :disabled="!canPrevious"
          :aria-label="$t('common.pagination.previous')"
          @click="changePage(safePage - 1)"
        >
          <ChevronLeft class="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          class="size-9"
          :disabled="!canNext"
          :aria-label="$t('common.pagination.next')"
          @click="changePage(safePage + 1)"
        >
          <ChevronRight class="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          class="hidden size-9 sm:inline-flex"
          :disabled="!canNext"
          :aria-label="$t('common.pagination.last')"
          @click="changePage(totalPages)"
        >
          <ChevronsRight class="size-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
