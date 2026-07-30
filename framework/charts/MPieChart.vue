
<script setup lang="ts">
import BasePie from "@/components/charts/apex/BasePie.vue"

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
  <BasePie
    :series="series"
    :labels="labels"
    :colors="colors"
    :title="title"
    :height="height"
    :formatter="formatter"
  />
</template>