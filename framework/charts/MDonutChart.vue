<script setup lang="ts">
import BaseDonut from "@/components/charts/apex/BaseDonut.vue"

withDefaults(defineProps<{
  series: number[]
  labels?: string[]
  colors?: string[]
  title?: string
  height?: string | number
  formatter?: (value: number) => string
}>(), {
  labels: () => [],
  colors: () => [],
  title: "",
  height: 320,
})
</script>

<template>
  <BaseDonut
    :series="series"
    :labels="labels"
    :colors="colors"
    :title="title"
    :height="height"
    :formatter="formatter"
  />
</template>