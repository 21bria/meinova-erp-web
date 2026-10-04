<template>
  <ClientOnly>
    <ApexChart
      ref="chart"
      type="bar"
      :height="height"
      :series="series"
      :options="mergedOptions"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import ApexChart from 'vue3-apexcharts'
import type { ApexAxisChartSeries, ApexOptions } from 'apexcharts'
import { numberFormatter } from './formatters'
import { useApexTheme } from './theme'

type Formatter = (value: number) => string

const props = withDefaults(defineProps<{
  series: ApexAxisChartSeries
  categories?: (string | number)[]
  colors?: string[]
  title?: string
  height?: number | string

  /*
   * Formatter untuk **sumbu nilai**, bukan untuk sumbu X secara harfiah.
   * Yang mana sumbu nilainya bergantung orientasi: pada batang mendatar
   * (bawaan) nilainya di sumbu X, pada batang tegak di sumbu Y. Apex
   * tetap menerima kategorinya lewat `xaxis.categories` di kedua
   * orientasi, jadi tanpa pembedaan ini formatter-nya menempel di sumbu
   * kategori dan angkanya tidak pernah terformat.
   */
  xFormatter?: Formatter
  tooltipFormatter?: Formatter

  // Mendatar tetap bawaan: seluruh bar chart yang sudah ada adalah
  // distribusi berlabel panjang (Company, Branch, …, Position), dan
  // label seperti itu tidak muat di sumbu X.
  horizontal?: boolean
  stacked?: boolean

  options?: ApexOptions
}>(), {
  categories: () => [],
  colors: () => [],
  title: '',
  height: 290,
  xFormatter: numberFormatter,
  tooltipFormatter: numberFormatter,
  horizontal: true,
  stacked: false,
})

const chart = ref<InstanceType<typeof ApexChart> | null>(null)

/*
 * Sumbu nilai yang isinya **cacahan** tidak boleh berlabel pecahan.
 *
 * Apex membagi sumbu nilai jadi lima ruas apa pun rentangnya, jadi
 * chart yang nilai terbesarnya 1 mendapat sumbu `0 | 0,2 | 0,4 | 0,6 |
 * 0,8 | 1` — "0,8 kontrak" dan "2,5 department". Formatter tidak bisa
 * menolongnya: yang salah letak tick-nya, bukan cara mencetaknya, dan
 * membulatkan label menghasilkan sumbu bertulis `1 1 1 0 0 0`.
 *
 * Jadi jumlah ruasnya yang disamakan dengan nilai terbesar — tick-nya
 * lalu jatuh tepat di bilangan bulat. Sengaja **hanya** untuk deret
 * yang seluruh nilainya bulat dan puncaknya kecil: di atas itu Apex
 * sudah memilih kelipatan yang wajar sendiri (0, 200, 400, …), dan
 * memaksakan satu tick per satuan di sana menghasilkan sumbu yang
 * tidak terbaca.
 */
const SMALL_COUNT_MAX = 8

const valueTicks = computed<number | undefined>(() => {
  const series = props.series as { data?: (number | null | undefined)[] }[]
  const perCategory: number[] = []

  for (const set of series) {
    for (const [index, raw] of (set?.data ?? []).entries()) {
      const value = Number(raw ?? 0)

      if (!Number.isFinite(value))
        continue

      // Satu nilai pecahan saja (mis. jam lembur 7,5) sudah membuat
      // sumbu bulat berbohong — biarkan Apex yang mengaturnya.
      if (!Number.isInteger(value))
        return undefined

      // Batang bertumpuk dibaca dari jumlah segmennya, bukan dari
      // segmen tertingginya.
      perCategory[index] = props.stacked
        ? (perCategory[index] ?? 0) + value
        : Math.max(perCategory[index] ?? 0, value)
    }
  }

  const max = Math.max(0, ...perCategory)

  return max > 0 && max <= SMALL_COUNT_MAX ? max : undefined
})

/*
 * Label kategori yang **lebar dan banyak** dimiringkan.
 *
 * Pada batang tegak kategorinya berbaris di sumbu X, dan dua belas
 * label "Agu 2026" berdempetan tanpa spasi di lebar kartu span-8:
 * terbaca "Agu 2026Sep 2026Okt 2026". Apex sendiri tidak
 * memiringkannya — label yang persis bersinggungan belum dihitung
 * bertindih, jadi ambang bawaannya tidak pernah tercapai.
 *
 * Lebar sebenarnya tidak diketahui di sini (opsi disusun sebelum chart
 * diukur), jadi yang dipakai perkiraan dari panjang teks: label
 * terpanjang 8 karakter atau lebih **dan** lebih dari enam kategori.
 * Perkiraan, dan memang disengaja konservatif — sumbu "Sep '25" milik
 * HR Period Summary (7 karakter) tetap mendatar seperti sebelumnya.
 */
const WIDE_LABEL_CHARS = 8
const CROWDED_CATEGORIES = 6

const rotateCategories = computed(() => {
  if (props.horizontal)
    return false

  const widest = Math.max(
    0,
    ...props.categories.map(value => String(value ?? '').length),
  )

  return widest >= WIDE_LABEL_CHARS
    && props.categories.length > CROWDED_CATEGORIES
})

const {
  isDark,
  textColor,
  borderColor,
  defaultColors,
  resolveColors,
} = useApexTheme()

// `colors` boleh berisi nama semantik ("success") maupun nilai CSS.
// Yang menerjemahkannya di sini, bukan di pemanggil: pemetaan
// terang↔gelap cuma diketahui sisi tema.
const palette = computed(() => resolveColors(props.colors))

const baseOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'bar',
    background: 'transparent',
    stacked: props.stacked,
    toolbar: { show: true },
    animations: { enabled: true, easing: 'easeinout', speed: 500 },
    fontFamily: 'Inter, sans-serif',
  },
  plotOptions: {
    bar: {
      horizontal: props.horizontal,
      // Sudut membulat di batang bertumpuk memotong sambungan antar
      // segmen — tumpukannya jadi terlihat seperti tiga batang terpisah
      // yang kebetulan berdempetan.
      borderRadius: props.stacked ? 2 : 6,
      barHeight: '55%',
      columnWidth: '60%',
    },
  },
  title: {
    text: props.title,
    align: 'left',
    style: { fontSize: '16px', fontWeight: 700, color: textColor.value },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: props.categories,
    labels: {
      formatter: props.horizontal ? props.xFormatter : undefined,
      rotate: rotateCategories.value ? -45 : 0,
      rotateAlways: rotateCategories.value,
      hideOverlappingLabels: true,
      style: { colors: textColor.value },
    },
    // Sumbu nilai pada batang mendatar; pada batang tegak sumbu ini
    // memuat kategori dan jumlah tick-nya ditentukan kategorinya.
    tickAmount: props.horizontal ? valueTicks.value : undefined,
    axisBorder: { color: borderColor.value },
    axisTicks: { color: borderColor.value },
  },
  yaxis: {
    labels: {
      formatter: props.horizontal ? undefined : props.xFormatter,
      style: { colors: textColor.value },
    },
    tickAmount: props.horizontal ? undefined : valueTicks.value,
  },
  tooltip: {
    theme: isDark.value ? 'dark' : 'light',
    y: { formatter: props.tooltipFormatter },
  },
  grid: { borderColor: borderColor.value, strokeDashArray: 2 },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    labels: { colors: textColor.value },
  },
}))

const themeOptions = computed<ApexOptions>(() => ({
  theme: { mode: isDark.value ? 'dark' : 'light' },
  colors: palette.value.length ? palette.value : defaultColors.value,
}))

const mergedOptions = computed<ApexOptions>(() => ({
  ...baseOptions.value,
  ...themeOptions.value,
  ...(props.options ?? {}),
}))

watch(isDark, () => {
  chart.value?.updateOptions?.(mergedOptions.value, false, true)
})
</script>