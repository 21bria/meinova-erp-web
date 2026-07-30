<template>
  <ClientOnly>
    <div
      ref="chartEl"
      class="w-full"
      :style="{ minHeight: `${height}px` }"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
type PlotlyTrace = Record<string, any>
type PlotlyLayout = Record<string, any>
type PlotlyConfig = Record<string, any>

const props = withDefaults(defineProps<{
  traces: PlotlyTrace[]
  layout?: PlotlyLayout
  config?: PlotlyConfig
  title?: string
  height?: number
}>(), {
  layout: () => ({}),
  config: () => ({}),
  title: '',
  height: 340,
})

const chartEl = ref<HTMLElement | null>(null)
let Plotly: any = null

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

async function ensurePlotly() {
  if (!import.meta.client)
    return null

  if (Plotly)
    return Plotly

  const mod = await import('plotly.js-dist-min')
  Plotly = mod.default || mod

  return Plotly
}

const baseLayout = computed<PlotlyLayout>(() => ({
  title: {
    text: props.title,
    x: 0.5,
    xanchor: 'center',
    y: 0.98,
    yanchor: 'top',
    font: {
      size: 16,
      color: isDark.value ? '#e5e7eb' : '#1e293b',
    },
  },

  height: props.height,

  margin: {
    l: 40,
    r: 20,
    t: props.title ? 80 : 30,
    b: 40,
  },

  legend: {
    orientation: 'h',
    x: 0,
    y: 1.12,
    xanchor: 'left',
    yanchor: 'bottom',
    font: {
      color: isDark.value ? '#e5e7eb' : '#1e293b',
    },
  },

  hoverlabel: {
    font: {
      size: 11,
    },
  },

  hovermode: 'closest',

  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: isDark.value
    ? 'rgba(15,23,42,0.35)'
    : 'rgba(248,250,252,0.8)',

  font: {
    family: 'Inter, sans-serif',
    color: isDark.value ? '#e5e7eb' : '#1e293b',
  },

  xaxis: {
    gridcolor: isDark.value ? '#334155' : '#e5e7eb',
    zerolinecolor: isDark.value ? '#475569' : '#cbd5e1',
  },

  yaxis: {
    gridcolor: isDark.value ? '#334155' : '#e5e7eb',
    zerolinecolor: isDark.value ? '#475569' : '#cbd5e1',
  },
}))

const finalLayout = computed<PlotlyLayout>(() => ({
  ...baseLayout.value,
  ...props.layout,
}))

const finalConfig = computed<PlotlyConfig>(() => ({
  responsive: true,
  displaylogo: false,
  modeBarButtonsToRemove: [
    'lasso2d',
    'select2d',
  ],
  ...props.config,
}))

async function renderChart() {
  if (!import.meta.client || !chartEl.value)
    return

  const plotly = await ensurePlotly()
  if (!plotly)
    return

  await plotly.react(
    chartEl.value,
    props.traces ?? [],
    finalLayout.value,
    finalConfig.value,
  )
}

onMounted(renderChart)

watch(
  () => [
    props.traces,
    props.layout,
    props.config,
    props.title,
    props.height,
    isDark.value,
  ],
  renderChart,
  { deep: true },
)

onBeforeUnmount(async () => {
  if (!import.meta.client || !chartEl.value)
    return

  const plotly = await ensurePlotly()

  if (plotly)
    plotly.purge(chartEl.value)
})
</script>