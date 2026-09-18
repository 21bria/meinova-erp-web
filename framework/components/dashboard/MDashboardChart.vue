<script setup lang="ts">
import { computed } from "vue"
import { translate } from "../../core/utils/i18n"

import {
  formatDashboardAxis,
  formatDashboardValue,
  seriesLabel,
} from "@framework/core/utils/dashboard"

import type {
  DashboardChartData,
  DashboardChartWidget,
} from "@framework/core/types/dashboard"

const props = defineProps<{
  widget: DashboardChartWidget
  data: DashboardChartData | null
  loading?: boolean
  /*
   * Bunyi keadaan kosong. Bawaannya menyebut periode — benar untuk
   * dashboard berperiode, dan salah untuk laporan potret seperti
   * Manpower Summary dan Contract Expiry: yang membacanya diberi tahu
   * untuk mengganti pemilih periode yang tidak ada di layar. Yang tahu
   * ada-tidaknya periode cuma `MDashboard`, jadi kalimatnya datang dari
   * sana.
   */
  emptyMessage?: string
}>()

const points = computed(() => props.data?.series ?? [])

/*
 * Dua bentuk data, dan yang kedua sengaja pakai kunci berbeda.
 *
 * `series` — satu deret `{label, value}`, bentuk lama yang dipakai
 * hampir semua widget. `datasets` + `categories` — banyak deret, untuk
 * chart bertumpuk. Memaksakan keduanya ke kunci `series` berarti
 * pembacanya harus menebak bentuk dari isinya, dan tebakan itu salah
 * tepat saat salah satu deretnya kosong.
 */
const datasets = computed(() => props.data?.datasets ?? [])

const isMulti = computed(() => datasets.value.length > 0)

const hasData = computed(() => {
  if (isMulti.value) {
    return datasets.value.some(set =>
      (set.data ?? []).some(value => value != null),
    )
  }

  return points.value.some(item => item.value != null)
})

const categories = computed(() => {
  if (isMulti.value)
    return props.data?.categories ?? []

  return points.value.map(item => seriesLabel(item.code, item.label))
})

// Apex tidak menerima `null` di beberapa tipe chart, tapi untuk line
// justru `null` yang benar: titik itu jadi putus, bukan jatuh ke nol.
const axisSeries = computed(() => {
  if (isMulti.value) {
    return datasets.value.map(set => ({
      name: seriesLabel(set.code, set.label),
      data: set.data ?? [],
    }))
  }

  return [
    {
      name: props.widget.y_label || props.widget.label || "Value",
      data: points.value.map(item => item.value),
    },
  ]
})

/*
 * Donut menerima **dua** bentuk data yang sama seperti chart lain.
 *
 * `series` — bentuk lama, satu titik per irisan (Leave Breakdown).
 * `datasets` + `categories` — satu deret berisi seluruh irisan, dan
 * itu yang dipakai Expiring by Department: resolver-nya sudah memotong
 * Top 8 + "Lainnya" dan bentuk itu tidak diubah hanya karena
 * tampilannya berganti. Tanpa cabang ini donut-nya menggambar `series`
 * yang kosong — kartunya berbunyi "Belum ada data" di sebelah
 * ringkasan Total yang jelas-jelas berisi.
 *
 * Deret **pertama** saja: donut memetakan satu ukuran ke irisan, dan
 * tidak ada bacaan yang masuk akal untuk deret kedua.
 */
const donutSeries = computed(() => {
  if (isMulti.value)
    return (datasets.value[0]?.data ?? []).map(value => Number(value ?? 0))

  return points.value.map(item => Number(item.value ?? 0))
})

/*
 * Warna per deret, kalau backend menyebutkannya. Isinya **nama
 * semantik** ("success"/"warning"/"danger") yang diterjemahkan lapisan
 * tema — hex yang terbaca jelas di latar putih lazimnya kusam di mode
 * gelap, dan yang tahu mode apa yang sedang dipakai cuma sisi ini.
 *
 * Kalau satu deret saja tidak menyebut warna, seluruh daftar dibuang:
 * Apex memakai `colors` sebagai rotasi berurutan, jadi daftar yang
 * bolong menggeser warna semua deret sesudahnya.
 */
const seriesColors = computed(() => {
  const source = isMulti.value
    ? datasets.value.map(set => set.color)
    : points.value.map(item => item.color)

  return source.every(Boolean) ? (source as string[]) : []
})

// Nama irisan = kategori, dan `categories` sudah memilih sumber yang
// benar untuk kedua bentuk data di atas.
const donutLabels = computed(() => categories.value)

/*
 * Warna donut menempel pada **irisan**, bukan pada deret.
 *
 * Pada bentuk `datasets` warnanya disebut sekali untuk seluruh deret
 * ("warning" pada Expiring by Department) — benar untuk batang, dan
 * salah untuk donut: Apex memutar daftar warna, jadi satu nama warna
 * mengecat **semua** irisannya kuning dan yang tersisa cuma legenda.
 * Di situ identitas irisan datang dari palet kategori, bukan dari
 * warna deretnya.
 *
 * Bentuk `series` tidak terpengaruh: di sana warnanya memang disebut
 * per titik, dan yang menyebutkannya tetap dihormati.
 */
const donutColors = computed(() => (isMulti.value ? [] : seriesColors.value))

function formatValue(value: number): string {
  return formatDashboardValue(value, props.widget.y_format ?? "number")
}

// Sumbu dipendekkan, tooltip tidak. Lihat `formatDashboardAxis`.
function formatAxis(value: number): string {
  return formatDashboardAxis(value, props.widget.y_format ?? "number")
}

/*
 * Ringkasan kecil di kanan judul: total untuk chart distribusi, dan
 * nilai titik terakhir untuk chart tren. Angka ini yang paling sering
 * dicari orang sebelum benar-benar membaca grafiknya.
 */
const summary = computed(() => {
  /*
   * Ada chart yang jumlah deretnya memang **bukan angka**, dan
   * menampilkannya lebih buruk daripada tidak menampilkan apa-apa.
   *
   * Komposisi Payroll memuat sisi penghasilan dan sisi potongan
   * sekaligus; jumlah keduanya bukan gross, bukan net, dan bukan biaya
   * — cuma dua bilangan berbeda arti yang dijumlahkan. Tercetak besar
   * di sebelah judul, ia terbaca sebagai angka utama kartunya.
   *
   * Schema yang tidak menyebut apa-apa tetap mendapat ringkasannya,
   * jadi seluruh chart yang sudah ada tidak berubah.
   */
  if (props.widget.summary === false) return null

  if (!hasData.value) return null

  // Titik terakhir hanya bermakna untuk chart **tren**, di mana sumbu
  // X-nya waktu dan "nilai terkini" memang yang dicari orang.
  //
  // Bar chart di sini lazimnya distribusi (Struktur Organisasi:
  // Company, Branch, …, Position), dan di situ titik terakhir cuma
  // kategori yang kebetulan diurutkan paling belakang. "Position
  // 1.049" tercetak besar di sebelah judul terbaca seperti angka utama
  // kartunya, padahal artinya sekadar "batang paling kanan".
  const isTrend = props.widget.chart === "line" || props.widget.chart === "area"

  if (!isTrend) {
    // Chart bertumpuk menjumlahkan seluruh deretnya, bukan cuma yang
    // pertama. Tanpa cabang ini `donutSeries` (yang membaca `series`)
    // kosong dan ringkasannya berbunyi "Total 0" di sebelah chart yang
    // jelas-jelas berisi.
    const stackedTotal = datasets.value.reduce<number>(
      (sum, set) =>
        sum + (set.data ?? []).reduce<number>(
          (inner, value) => inner + Number(value ?? 0),
          0,
        ),
      0,
    )

    const total = props.data?.total
      ?? (
        isMulti.value
          ? stackedTotal
          : donutSeries.value.reduce((sum, value) => sum + value, 0)
      )

    return {
      label: translate("common.labels.total", "Total"),
      value: formatValue(total),
    }
  }

  const filled = points.value.filter(item => item.value != null)
  const last = filled[filled.length - 1]

  if (!last) return null

  return { label: last.label, value: formatValue(Number(last.value)) }
})
</script>

<template>
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

        <div v-if="summary" class="shrink-0 text-right">
          <p class="text-xs text-muted-foreground">
            {{ summary.label }}
          </p>
          <p class="text-lg font-semibold tabular-nums">
            {{ summary.value }}
          </p>
        </div>
      </div>
    </CardHeader>

    <CardContent class="flex-1 p-2 sm:p-3">
      <MChartLoading v-if="loading" />

      <MChartEmpty
        v-else-if="!hasData"
        :message="emptyMessage ?? translate('common.state.noDataPeriod', 'No data for this period.')"
      />

      <MDonutChart
        v-else-if="widget.chart === 'donut'"
        :series="donutSeries"
        :labels="donutLabels"
        :colors="donutColors"
      />

      <MBarChart
        v-else-if="widget.chart === 'bar'"
        :series="axisSeries as never"
        :categories="categories"
        :y-formatter="formatAxis"
        :tooltip-formatter="formatValue"
        :colors="seriesColors"
        :horizontal="widget.horizontal ?? true"
        :stacked="widget.stacked ?? false"
      />

      <MAreaChart
        v-else-if="widget.chart === 'area'"
        :series="axisSeries as never"
        :categories="categories"
        :y-formatter="formatAxis"
        :tooltip-formatter="formatValue"
      />

      <MLineChart
        v-else
        :series="axisSeries as never"
        :categories="categories"
        :y-formatter="formatAxis"
        :tooltip-formatter="formatValue"
      />
    </CardContent>
  </Card>
</template>
