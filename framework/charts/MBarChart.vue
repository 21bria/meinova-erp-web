<script setup lang="ts">
import type { ApexAxisChartSeries } from "apexcharts"
import BaseBar from "@/components/charts/apex/BaseBar.vue"

withDefaults(defineProps<{
  series: ApexAxisChartSeries

  categories?: (string | number)[]
  colors?: string[]
  title?: string
  height?: string | number

  // Formatter sumbu **nilai**. Namanya `yFormatter` karena itu yang
  // dipakai seluruh pemanggil dashboard; `BaseBar` yang memutuskan
  // sumbu mana yang menerimanya, mengikuti orientasi batangnya.
  yFormatter?: (value: number) => string
  tooltipFormatter?: (value: number) => string

  horizontal?: boolean
  stacked?: boolean
}>(), {
  categories: () => [],
  colors: () => [],
  title: "",
  height: 320,
  horizontal: true,
  stacked: false,
})
</script>

<template>
  <BaseBar
    :series="series"
    :categories="categories"
    :colors="colors"
    :title="title"
    :height="height"
    :x-formatter="yFormatter"
    :tooltip-formatter="tooltipFormatter"
    :horizontal="horizontal"
    :stacked="stacked"
  />
</template>
