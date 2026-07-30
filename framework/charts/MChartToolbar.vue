<script setup lang="ts">
import { Download, Maximize2, RefreshCw } from "lucide-vue-next"
import { Button } from "@/components/ui/button"

defineProps<{
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
  <div class="flex items-center gap-2">
    <Button
      v-if="showRefresh"
      variant="ghost"
      size="sm"
      :disabled="loading"
      @click="$emit('refresh')"
    >
      <RefreshCw class="size-4" />
    </Button>

    <Button
      v-if="showExport"
      variant="ghost"
      size="sm"
      :disabled="loading"
      @click="$emit('export')"
    >
      <Download class="size-4" />
    </Button>

    <Button
      v-if="showFullscreen"
      variant="ghost"
      size="sm"
      @click="$emit('fullscreen')"
    >
      <Maximize2 class="size-4" />
    </Button>
  </div>
</template>