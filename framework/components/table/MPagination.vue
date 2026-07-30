<script setup lang="ts">
import { computed } from "vue"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-vue-next"

import { Button } from "@/components/ui/button"

const props = withDefaults(defineProps<{
  page: number
  pageSize: number
  total: number
  loading?: boolean
  pageSizeOptions?: number[]
}>(), {
  loading: false,
  pageSizeOptions: () => [10, 25, 50, 100],
})

const emit = defineEmits<{
  (e: "update:page", value: number): void
  (e: "update:pageSize", value: number): void
}>()

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / props.pageSize)),
)

const from = computed(() =>
  props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1,
)

const to = computed(() =>
  Math.min(props.page * props.pageSize, props.total),
)

function changePage(page: number) {
  emit("update:page", Math.min(Math.max(page, 1), totalPages.value))
}

function changePageSize(value: Event) {
  emit("update:pageSize", Number((value.target as HTMLSelectElement).value))
}
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div class="text-sm text-muted-foreground">
      Showing {{ from }}-{{ to }} of {{ total }}
    </div>

    <div class="flex items-center gap-2">
      <select
        class="h-9 rounded-md border bg-background px-2 text-sm"
        :value="pageSize"
        :disabled="loading"
        @change="changePageSize"
      >
        <option
          v-for="option in pageSizeOptions"
          :key="option"
          :value="option"
        >
          {{ option }} / page
        </option>
      </select>

      <Button variant="outline" size="icon" :disabled="loading || page <= 1" @click="changePage(1)">
        <ChevronsLeft class="size-4" />
      </Button>

      <Button variant="outline" size="icon" :disabled="loading || page <= 1" @click="changePage(page - 1)">
        <ChevronLeft class="size-4" />
      </Button>

      <div class="min-w-24 text-center text-sm">
        {{ page }} / {{ totalPages }}
      </div>

      <Button variant="outline" size="icon" :disabled="loading || page >= totalPages" @click="changePage(page + 1)">
        <ChevronRight class="size-4" />
      </Button>

      <Button variant="outline" size="icon" :disabled="loading || page >= totalPages" @click="changePage(totalPages)">
        <ChevronsRight class="size-4" />
      </Button>
    </div>
  </div>
</template>