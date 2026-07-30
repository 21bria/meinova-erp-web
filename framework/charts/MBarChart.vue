<script setup lang="ts">
import type { ApexAxisChartSeries } from "apexcharts"
import BaseBar from "@/components/charts/apex/BaseBar.vue"

withDefaults(defineProps<{
  series: ApexAxisChartSeries

  categories?: (string | number)[]
  colors?: string[]
  title?: string
  height?: string | number

  yFormatter?: (value: number) => string
  tooltipFormatter?: (value: number) => string
}>(), {
  categories: () => [],
  colors: () => [],
  title: "",
  height: 320,
})
</script>

<template>
  <BaseBar
    :series="series"
    :categories="categories"
    :colors="colors"
    :title="title"
    :height="height"
    :y-formatter="yFormatter"
    :tooltip-formatter="tooltipFormatter"
  />
</template>