<script setup lang="ts">
import type { TreeConfig } from "@framework"

defineProps<{
  config: TreeConfig
}>()
</script>

<template>
  <MTreeBuilder :config="config" />
</template>