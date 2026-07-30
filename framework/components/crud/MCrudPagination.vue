<script setup lang="ts">
import MPagination from "../table/MPagination.vue"

defineProps<{
  page: number
  pageSize: number
  total: number
  loading?: boolean
  pageSizeOptions?: number[]
}>()

const emit = defineEmits<{
  (e: "update:page", page: number): void
  (e: "update:pageSize", pageSize: number): void
}>()
</script>

<template>
  <MPagination
    :page="page"
    :page-size="pageSize"
    :total="total"
    :loading="loading"
    :page-size-options="pageSizeOptions"
    @update:page="(v) => emit('update:page', v)"
    @update:page-size="(v) => emit('update:pageSize', v)"
  />
</template>