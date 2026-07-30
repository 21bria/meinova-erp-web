<script setup lang="ts">
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-vue-next"

const props = defineProps<{
  column: any
  title: string
}>()

function toggleSort() {
  const current = props.column.getIsSorted()

  if (current === "asc") {
    props.column.toggleSorting(true)
  } else if (current === "desc") {
    props.column.clearSorting()
  } else {
    props.column.toggleSorting(false)
  }
}
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 text-sm font-medium"
    @click="toggleSort"
  >
    {{ title }}

    <ArrowUp
      v-if="column.getIsSorted() === 'asc'"
      class="size-4"
    />

    <ArrowDown
      v-else-if="column.getIsSorted() === 'desc'"
      class="size-4"
    />

    <ChevronsUpDown
      v-else
      class="size-4 text-muted-foreground"
    />
  </button>
</template>