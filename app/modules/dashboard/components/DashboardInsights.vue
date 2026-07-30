<script setup lang="ts">
import { BaseArea, BaseDonut } from '~/components/charts'
import type { DashboardChart } from '../types'

defineProps<{
  charts: DashboardChart[]
}>()
</script>

<template>
  <section class="grid gap-4 lg:grid-cols-[1fr_360px]">
    <Card
      v-for="chart in charts"
      :key="chart.code"
    >
      <CardContent class="pt-6">
        <BaseArea
          v-if="chart.type === 'area'"
          :title="chart.title"
          :series="chart.series"
          :categories="chart.categories"
          :height="chart.height || 320"
        />

        <BaseDonut
          v-else-if="chart.type === 'donut'"
          :title="chart.title"
          :series="chart.series as number[]"
          :labels="chart.categories as string[]"
          :height="chart.height || 320"
        />
      </CardContent>
    </Card>
  </section>
</template>