<script setup lang="ts">
import type { DashboardChart } from '../types'

/**
 * Sebaran status dokumen berjalan, versi kolom sempit.
 *
 * Menggantikan donut selebar 300px yang dulu berdiri sebagai kartu
 * sepertiga halaman. Di kolom selebar 320px donut itu menyisakan
 * potongan warna tanpa keterangan — dan yang dicari orang dari kartu
 * ini adalah satu angka: berapa yang masih menunggu.
 *
 * **Tidak ada status baru yang diciptakan di sini.** Barisnya persis
 * apa yang dikirim `DashboardSummaryService.approval_status`, yang
 * sendirinya sudah tersaring `visible_instances` — jadi kartu ini
 * tidak memperlihatkan satu dokumen pun yang layar monitoringnya
 * menyembunyikannya.
 */
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  charts: DashboardChart[]
}>()

const { t, te } = useI18n()

/**
 * Warna titik per kode status — **bukan** per urutan.
 *
 * Diwarnai berdasarkan urutan, satu status yang jumlahnya turun ke nol
 * menggeser warna semua yang di bawahnya, dan "Rejected" berubah hijau
 * tanpa ada yang menyentuh kode ini.
 */
const STATUS_DOT: Record<string, string> = {
  pending: 'bg-amber-500',
  approved: 'bg-emerald-500',
  rejected: 'bg-rose-500',
  cancelled: 'bg-slate-400',
  returned: 'bg-sky-500',
}

interface Row {
  code: string
  label: string
  value: number
}

/**
 * Chart donut yang dikirim beranda dibongkar jadi baris.
 *
 * Bentuk dua array sejajar (`series` + `categories`) datang dari
 * kebutuhan komponen chart; di sini yang dibutuhkan barisnya, jadi
 * dirapatkan kembali.
 */
const rows = computed<Row[]>(() => {
  const chart = props.charts?.[0]

  if (!chart)
    return []

  const values = (chart.series ?? []) as number[]
  const labels = (chart.categories ?? []) as string[]
  const codes = (chart.codes ?? []) as string[]

  return values.map((value, index) => {
    const code = codes[index] ?? ''
    const key = `common.status.${code}`

    return {
      code,
      // Label backend cuma dipakai kalau kodenya belum punya
      // terjemahan — modul baru boleh membawa status yang belum ada di
      // katalog tanpa membuat barisnya kosong.
      label: te(key) ? t(key) : (labels[index] ?? code),
      value: Number(value ?? 0),
    }
  })
})

const total = computed(() =>
  rows.value.reduce((sum, row) => sum + row.value, 0),
)
</script>

<template>
  <div>
    <ul v-if="rows.length" class="space-y-1">
      <li
        v-for="row in rows"
        :key="row.code || row.label"
        class="flex items-center gap-2 py-1 text-sm"
      >
        <span
          class="size-2 shrink-0 rounded-full"
          :class="STATUS_DOT[row.code] ?? 'bg-muted-foreground/40'"
        />

        <span class="truncate text-muted-foreground">{{ row.label }}</span>

        <span class="ml-auto shrink-0 font-medium tabular-nums">
          {{ row.value }}
        </span>
      </li>
    </ul>

    <p v-else class="py-4 text-center text-xs text-muted-foreground">
      {{ $t('home.approval.empty') }}
    </p>

    <div
      v-if="rows.length"
      class="mt-2 flex items-center justify-between gap-2 border-t pt-2 text-xs"
    >
      <span class="truncate text-muted-foreground">
        {{ $t('home.approval.total') }}
        <span class="font-medium text-foreground tabular-nums">{{ total }}</span>
      </span>

      <!--
        Tujuannya tetap layar Running Documents yang sama seperti
        sebelumnya: yang mencari dokumen tertentu butuh filter dan
        pencarian, dan keduanya sudah ada di sana.
      -->
      <NuxtLink
        to="/workflow/instances"
        class="shrink-0 font-medium text-muted-foreground hover:text-foreground"
      >
        {{ $t('home.utility.viewAll') }}
      </NuxtLink>
    </div>
  </div>
</template>
