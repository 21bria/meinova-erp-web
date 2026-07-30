<script setup lang="ts">
import type { TreeNode } from "@framework"

defineProps<{
  node: TreeNode
}>()
</script>

<template>
  <div>
    {{ node.label }}
  </div>
</template>