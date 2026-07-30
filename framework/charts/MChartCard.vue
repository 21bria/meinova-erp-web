<script setup lang="ts">
import MChartToolbar from "./MChartToolbar.vue"

defineProps<{
  title?: string
  subtitle?: string
  loading?: boolean
  showRefresh?: boolean
  showExport?: boolean
  showFullscreen?: boolean
}>()

defineEmits<{
  (e: "refresh"): void
  (e: "export"): void
  (e: "fullscreen"): void
}>()
</script>

<template>
  <section class="rounded-xl border bg-card p-5">
    <div class="mb-4 flex items-start justify-between gap-4">
      <div>
        <h3 v-if="title" class="font-medium">
          {{ title }}
        </h3>

        <p v-if="subtitle" class="mt-1 text-sm text-muted-foreground">
          {{ subtitle }}
        </p>
      </div>

      <MChartToolbar
        :loading="loading"
        :show-refresh="showRefresh"
        :show-export="showExport"
        :show-fullscreen="showFullscreen"
        @refresh="$emit('refresh')"
        @export="$emit('export')"
        @fullscreen="$emit('fullscreen')"
      />
    </div>

    <slot />
  </section>
</template>