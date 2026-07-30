<script setup lang="ts">
import MCrudActions from "../crud/MCrudActions.vue"

defineProps<{
  row: any
  onEdit: (row: any) => void
  onDelete: (row: any) => void
}>()
</script>

<template>
  <MCrudActions
    :row="row"
    @edit="onEdit"
    @delete="onDelete"
  />
</template>