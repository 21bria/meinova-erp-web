<template>
  <ClientOnly>
    <ApexChart
      ref="chart"
      type="donut"
      :height="height"
      :series="series"
      :options="mergedOptions"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import ApexChart from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { numberFormatter } from './formatters'
import { useApexTheme } from './theme'

type Formatter = (value: number) => string

const props = withDefaults(defineProps<{
  series: number[]
  labels?: string[]
  colors?: string[]
  title?: string
  height?: number | string
  formatter?: Formatter
  options?: ApexOptions
}>(), {
  labels: () => [],
  colors: () => [],
  title: '',
  height: 290,
  formatter: numberFormatter,
})

const chart = ref<InstanceType<typeof ApexChart> | null>(null)
const { isDark, textColor, defaultColors } = useApexTheme()

const baseOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'donut',
    background: 'transparent',
    toolbar: { show: false },
    animations: { enabled: true, easing: 'easeinout', speed: 500 },
    fontFamily: 'Inter, sans-serif',
  },
  labels: props.labels,
  title: {
    text: props.title,
    align: 'left',
    style: { fontSize: '16px', fontWeight: 700, color: textColor.value },
  },
  dataLabels: {
    enabled: true,
    formatter: (value: number) => `${value.toFixed(1)}%`,
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    labels: { colors: textColor.value },
  },
  tooltip: {
    theme: isDark.value ? 'dark' : 'light',
    y: { formatter: props.formatter },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '68%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            color: textColor.value,
            formatter: () => props.formatter(
              props.series.reduce((total, item) => total + Number(item), 0),
            ),
          },
        },
      },
    },
  },
}))

const themeOptions = computed<ApexOptions>(() => ({
  theme: { mode: isDark.value ? 'dark' : 'light' },
  colors: props.colors.length ? props.colors : defaultColors.value,
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