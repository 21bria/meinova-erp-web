<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import type { QuickAction } from '../types'

defineProps<{
  items: QuickAction[]
}>()
</script>

<template>
  <section>
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-lg font-semibold">Quick Actions</h2>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <NuxtLink
        v-for="item in items"
        :key="item.code"
        :to="item.href"
        class="group flex items-center gap-3 rounded-2xl border bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl"
          :class="item.color || 'bg-muted text-muted-foreground'"
        >
          <component :is="item.icon" v-if="item.icon" class="h-5 w-5" />
        </div>

        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium">{{ item.title }}</p>
          <p class="text-xs text-muted-foreground">Create new record</p>
        </div>

        <ArrowRight class="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1" />
      </NuxtLink>
    </div>
  </section>
</template>