<script setup lang="ts">
import { computed, resolveComponent } from "vue"
import { translate } from "../../core/utils/i18n"

import { formatDashboardValue } from "@framework/core/utils/dashboard"

import type {
  DashboardListData,
  DashboardListWidget,
} from "@framework/core/types/dashboard"

const props = defineProps<{
  widget: DashboardListWidget
  data: DashboardListData | null
  loading?: boolean
}>()

/*
 * `resolveComponent`, **bukan** string "NuxtLink" di `:is`.
 *
 * Nama komponen yang cuma muncul sebagai string tidak ikut
 * ditransformasi auto-import, jadi Vue memperlakukannya sebagai elemen
 * HTML biasa: barisnya tampil normal, kursornya berubah, dan **tidak
 * melakukan apa pun saat diklik** — tanpa satu pun error di konsol.
 * Baris `<nuxtlink to="/payroll/payroll-runs/8">` yang mati itu persis
 * yang ditemukan UAT Payroll Dashboard di kartu "Perlu
 * Ditindaklanjuti": seluruh temuan terlihat bisa ditekan, tidak satu
 * pun membawa ke mana-mana.
 *
 * Jebakan yang sama sudah pernah kena di kartu KPI dashboard utama
 * (`DashboardKpi.vue`); catatannya ditinggalkan di sini juga karena
 * yang membaca berkas ini belum tentu pernah membuka yang itu.
 */
const NuxtLinkComponent = resolveComponent("NuxtLink")

const items = computed(() => props.data?.items ?? [])

const columns = computed(() => props.widget.columns ?? [])

/*
 * Tujuan "Lihat Semua": yang dari data menang atas yang dari schema.
 *
 * Schema di-generate jadi file statis, jadi ia tidak bisa menyebut
 * tujuan yang baru diketahui saat resolvernya jalan — "buka payroll
 * run yang sedang dibaca" berisi id yang berganti tiap kali filternya
 * berganti. Yang di schema tetap dipakai kalau data tidak menyebut
 * apa-apa, jadi seluruh daftar yang sudah ada tidak berubah.
 */
const headerLink = computed(
  () => (props.data as { link?: string } | null)?.link ?? props.widget.link,
)

function rowLink(row: Record<string, unknown>): string | null {
  const value = row.link

  return typeof value === "string" && value ? value : null
}

// Kolom pertama jadi judul baris, kolom kedua jadi keterangan di
// bawahnya, sisanya jadi angka di kanan — bentuk ini lebih terbaca di
// kartu sempit daripada tabel penuh yang harus digeser.
const titleColumn = computed(() => columns.value[0] ?? null)

const subtitleColumn = computed(() => {
  const second = columns.value[1]

  if (!second) return null

  // Kolom kedua hanya dipakai sebagai keterangan kalau isinya memang
  // teks; angka lebih berguna berdiri sendiri di kanan.
  return (second.format ?? "text") === "text" ? second : null
})

const metaColumns = computed(() =>
  columns.value.slice(1).filter(column => column !== subtitleColumn.value),
)

function cell(row: Record<string, unknown>, key: string, format?: string) {
  return formatDashboardValue(row[key], (format ?? "text") as never)
}

/**
 * Keterangan yang memang kosong tidak dirender sama sekali.
 *
 * `formatDashboardValue` mengembalikan "—" untuk nilai kosong, dan itu
 * benar di kolom angka: "—" berarti "tidak ada datanya", berbeda dari
 * nol. Sebagai **subjudul** artinya terbalik — daftar Kesehatan
 * Konfigurasi yang seluruh barisnya sehat jadi delapan baris bergaris
 * datar di bawah namanya, seolah ada yang gagal dimuat. Yang tidak
 * punya keterangan memang tidak perlu barisnya.
 */
function hasValue(row: Record<string, unknown>, key: string): boolean {
  const value = row[key]

  return value != null && value !== ""
}

// Warna badge untuk kolom ber-format "status". Diambil dari `state`
// pada barisnya, bukan dari teksnya: status yang sama bisa berbunyi
// "Siap" di satu widget dan "Terisi 2026" di widget lain, dan mencocokkan
// string berarti tiap kalimat baru harus didaftarkan di sini.
const STATE_CLASS: Record<string, string> = {
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger: "bg-red-500/10 text-red-600 dark:text-red-400",
}

function stateClass(row: Record<string, unknown>): string {
  return STATE_CLASS[String(row.state ?? "")] ?? "bg-muted text-muted-foreground"
}

function initials(row: Record<string, unknown>): string {
  const source = titleColumn.value
    ? String(row[titleColumn.value.key] ?? "")
    : ""

  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() ?? "")
    .join("") || "–"
}
</script>

<template>
  <!--
    `h-full` supaya kartu mengisi tinggi barisnya — sebentuk dengan
    `MDashboardChart`, dan itu yang membuat tiga kartu sebaris rata
    tepi bawahnya. Lihat catatan di `MDashboard.vue`: tanpa ini tepi
    bawah yang bergerigi terbaca sebagai tata letak yang rusak.
  -->
  <Card class="flex h-full flex-col gap-0 border-border/60 py-0 shadow-xs">
    <CardHeader class="gap-0 border-b p-4 sm:p-5">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <CardTitle class="text-base">
            {{ widget.label }}
          </CardTitle>

          <CardDescription v-if="widget.description" class="mt-1 line-clamp-2">
            {{ widget.description }}
          </CardDescription>
        </div>

        <NuxtLink
          v-if="headerLink"
          :to="headerLink"
          class="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {{ translate("common.actions.viewAll", "View All") }}
          <Icon name="i-lucide-arrow-right" class="size-3.5" />
        </NuxtLink>
      </div>
    </CardHeader>

    <!--
      Isinya dibatasi tinggi lalu digulir sendiri, dan kartunya tidak
      ikut meregang.

      Tanpa batas ini, satu daftar delapan baris (Pengingat Kepegawaian)
      menentukan tinggi seluruh barisnya, dan sejak kartunya diregangkan
      seluruh baris ikut setinggi itu — termasuk kartu di sebelahnya
      yang cuma berisi satu hari libur.

      `min-h-0` wajib menyertainya: anak sebuah flex punya
      `min-height: auto` bawaan, jadi tanpa itu isinya menolak menyusut
      dan `overflow-y-auto` tidak pernah menyala — daftar panjang
      memanjangkan kartunya alih-alih menggulir di dalamnya.
    -->
    <CardContent class="max-h-80 min-h-0 flex-1 overflow-y-auto p-2 sm:p-3">
      <div v-if="loading" class="space-y-2 p-1">
        <Skeleton v-for="n in 4" :key="n" class="h-14 w-full rounded-lg" />
      </div>

      <div
        v-else-if="!items.length"
        class="flex h-full min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center"
      >
        <Icon name="i-lucide-inbox" class="size-6 text-muted-foreground/50" />

        <p class="text-sm text-muted-foreground">
          {{ widget.empty_text ?? translate("common.state.noData", "No data found") }}
        </p>
      </div>

      <ul v-else class="divide-y">
        <!--
          Barisnya jadi tautan **hanya kalau datanya menyebutkan
          tujuan**. `component`-nya diganti, bukan dibungkus `<a>` di
          dalam `<li>`: membungkus isinya membuat area yang bisa
          ditekan cuma seluas teksnya, dan yang ditekan orang adalah
          barisnya.

          Daftar yang barisnya tidak bertujuan tetap `<li>` biasa —
          kursor penunjuk pada baris yang tidak melakukan apa-apa
          adalah janji yang tidak ditepati.
        -->
        <component
          :is="rowLink(row) ? NuxtLinkComponent : 'li'"
          v-for="(row, index) in items"
          :key="String(row.id ?? index)"
          :to="rowLink(row) ?? undefined"
          class="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/50"
          :class="rowLink(row) && 'cursor-pointer'"
        >
          <span
            class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground"
          >
            {{ initials(row) }}
          </span>

          <div class="min-w-0 flex-1">
            <p v-if="titleColumn" class="truncate text-sm font-medium">
              {{ cell(row, titleColumn.key, titleColumn.format) }}
            </p>

            <p
              v-if="subtitleColumn && hasValue(row, subtitleColumn.key)"
              class="truncate text-xs text-muted-foreground"
            >
              {{ cell(row, subtitleColumn.key, subtitleColumn.format) }}
            </p>
          </div>

          <div class="flex shrink-0 items-center gap-4">
            <div
              v-for="column in metaColumns"
              :key="column.key"
              class="text-right"
            >
              <p class="text-[11px] uppercase tracking-wide text-muted-foreground">
                {{ column.label }}
              </p>

              <span
                v-if="column.format === 'status'"
                class="mt-0.5 inline-flex rounded-md px-2 py-0.5 text-xs font-medium"
                :class="stateClass(row)"
              >
                {{ cell(row, column.key, column.format) }}
              </span>

              <p v-else class="text-sm font-semibold tabular-nums">
                {{ cell(row, column.key, column.format) }}
              </p>
            </div>
          </div>
        </component>
      </ul>
    </CardContent>
  </Card>
</template>
