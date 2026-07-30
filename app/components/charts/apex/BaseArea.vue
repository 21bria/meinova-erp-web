<template>
  <ClientOnly>
    <ApexChart
      ref="chart"
      type="area"
      :height="height"
      :series="series"
      :options="mergedOptions"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import ApexChart from 'vue3-apexcharts'
import type { ApexAxisChartSeries, ApexOptions } from 'apexcharts'
import { useApexTheme } from './theme'
import { numberFormatter, thousandFormatter } from './formatters'

type Formatter = (value: number) => string

const props = withDefaults(defineProps<{
  series: ApexAxisChartSeries
  categories?: (string | number)[]
  colors?: string[]
  title?: string
  height?: number | string
  yFormatter?: Formatter
  tooltipFormatter?: Formatter
  options?: ApexOptions
}>(), {
  categories: () => [],
  colors: () => [],
  title: '',
  height: 290,
  yFormatter: thousandFormatter,
  tooltipFormatter: numberFormatter,
})

const chart = ref<InstanceType<typeof ApexChart> | null>(null)

const {
  isDark,
  textColor,
  borderColor,
  defaultColors,
} = useApexTheme()

const baseOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'area',
    background: 'transparent',
    zoom: {
      enabled: true,
      type: 'x',
      autoScaleYaxis: true,
    },
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false,
      },
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 500,
    },
    fontFamily: 'Inter, sans-serif',
  },

  title: {
    text: props.title,
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: 700,
      color: textColor.value,
    },
  },

  stroke: {
    curve: 'smooth',
    width: 2,
  },

  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.08,
      stops: [0, 90, 100],
    },
  },

  dataLabels: {
    enabled: false,
  },

  xaxis: {
    categories: props.categories,
    labels: {
      style: {
        colors: textColor.value,
      },
    },
    axisBorder: {
      color: borderColor.value,
    },
    axisTicks: {
      color: borderColor.value,
    },
  },

  yaxis: {
    show: true,
    labels: {
      formatter: props.yFormatter,
      style: {
        colors: textColor.value,
      },
    },
  },

  tooltip: {
    theme: isDark.value ? 'dark' : 'light',
    y: {
      formatter: props.tooltipFormatter,
    },
  },

  grid: {
    borderColor: borderColor.value,
    strokeDashArray: 2,
  },

  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    labels: {
      colors: textColor.value,
    },
  },

  responsive: [
    {
      breakpoint: 768,
      options: {
        legend: {
          position: 'bottom',
          horizontalAlign: 'left',
          fontSize: '11px',
          itemMargin: {
            horizontal: 8,
            vertical: 4,
          },
        },
      },
    },
  ],
}))

const themeOptions = computed<ApexOptions>(() => ({
  theme: {
    mode: isDark.value ? 'dark' : 'light',
  },
  colors: props.colors.length
    ? props.colors
    : defaultColors.value,
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