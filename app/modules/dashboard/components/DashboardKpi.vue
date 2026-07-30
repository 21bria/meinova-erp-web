<script setup lang="ts">
import { TrendingDown, TrendingUp } from 'lucide-vue-next'
import type { DashboardKpi } from '../types'

defineProps<{
  items: DashboardKpi[]
}>()
</script>

<template>
  <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <Card
      v-for="item in items"
      :key="item.code"
      class="transition-all hover:shadow-md"
    >
      <CardHeader class="flex flex-row items-center justify-between pb-2">
        <CardDescription>{{ item.title }}</CardDescription>

        <component
          :is="item.icon"
          v-if="item.icon"
          class="h-4 w-4"
          :class="item.color || 'text-muted-foreground'"
        />
      </CardHeader>

      <CardContent>
        <div class="text-3xl font-bold">
          {{ item.value }}
        </div>

        <div
          v-if="item.change !== undefined"
          class="mt-2 flex items-center gap-1 text-xs"
          :class="item.trend === 'down' ? 'text-red-600' : 'text-emerald-600'"
        >
          <TrendingDown
            v-if="item.trend === 'down'"
            class="h-3 w-3"
          />
          <TrendingUp
            v-else
            class="h-3 w-3"
          />

          {{ item.change > 0 ? '+' : '' }}{{ item.change }}% this month
        </div>
      </CardContent>
    </Card>
  </section>
</template>