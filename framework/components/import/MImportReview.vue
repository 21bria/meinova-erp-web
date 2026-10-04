<script setup lang="ts">
import MImportPreviewTable
  from "./MImportPreviewTable.vue"

import MImportSummary
  from "./MImportSummary.vue"

import type {
  ImportPreviewColumn,
  ImportPreviewResult,
} from "../../core/types/import"

const props = defineProps<{
  preview: ImportPreviewResult
  columns: ImportPreviewColumn[]

  importing?: boolean
  loadingPage?: boolean
}>()

const emit = defineEmits<{
  back: []
  confirm: []
  "page-change": [page: number]
  "page-size-change": [pageSize: number]
}>()

const currentPage = computed(() => {
  return props.preview.page ?? 1
})

const totalPages = computed(() => {
  return props.preview.totalPages ?? 1
})

const pageSize = computed(() => {
  return props.preview.pageSize ?? 50
})

const startRow = computed(() => {
  if (
    props.preview.totalRows === 0
  ) {
    return 0
  }

  return (
    (
      currentPage.value - 1
    )
    * pageSize.value
  ) + 1
})

const endRow = computed(() => {
  return Math.min(
    currentPage.value
    * pageSize.value,

    props.preview.totalRows,
  )
})

function previousPage() {
  if (currentPage.value <= 1)
    return

  emit(
    "page-change",
    currentPage.value - 1,
  )
}

function nextPage() {
  if (
    currentPage.value
    >= totalPages.value
  ) {
    return
  }

  emit(
    "page-change",
    currentPage.value + 1,
  )
}
</script>

<template>
  <div class="space-y-6">
    <div class="
        flex flex-col gap-4
        rounded-xl border
        bg-muted/20 px-5 py-4
        sm:flex-row
        sm:items-center
        sm:justify-between
      ">
      <div>
        <h2 class="font-semibold">
          Review Import
        </h2>

        <p class="mt-1 text-sm text-muted-foreground">
          Check the summary and invalid
          records before importing.
        </p>
      </div>

      <Button type="button" variant="outline" :disabled="importing
        || loadingPage
        " @click="emit('back')">
        Change File
      </Button>
    </div>

    <MImportSummary :preview="preview" />

    <MImportPreviewTable :columns="columns" :rows="preview.rows" />

    <div class="
        flex flex-col gap-4
        rounded-xl border
        bg-background px-5 py-4
        md:flex-row
        md:items-center
        md:justify-between
      ">
      <div class="text-sm text-muted-foreground">
        Showing
        <span class="font-medium text-foreground">
          {{ startRow }}
        </span>
        –
        <span class="font-medium text-foreground">
          {{ endRow }}
        </span>
        of
        <span class="font-medium text-foreground">
          {{ preview.totalRows }}
        </span>
        rows
      </div>

     <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="flex items-center gap-2">
        <span class="whitespace-nowrap text-sm text-muted-foreground">
          Rows per page
        </span>

        <Select
          :model-value="
            String(pageSize)
          "
          :disabled="
            loadingPage
            || importing
          "
          @update:model-value="
            emit(
              'page-size-change',
              Number($event),
            )
          "
        >
          <SelectTrigger class="w-[105px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="25">
              25
            </SelectItem>

            <SelectItem value="50">
              50
            </SelectItem>

            <SelectItem value="100">
              100
            </SelectItem>

            <SelectItem value="200">
              200
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          :disabled="
            currentPage <= 1
            || loadingPage
            || importing
          "
          @click="previousPage"
        >
          Previous
        </Button>

        <div class="min-w-[110px] text-center text-sm">
          Page
          <span class="font-medium">
            {{ currentPage }}
          </span>
          of
          <span class="font-medium">
            {{ totalPages }}
          </span>
        </div>

        <Button type="button" variant="outline" size="sm"
          :disabled="
            currentPage >= totalPages
            || loadingPage
            || importing
          "
          @click="nextPage"
        >
          {{
            loadingPage
              ? "Loading..."
              : "Next"
          }}
        </Button>
      </div>

      <Button
        type="button"
        :disabled="
          importing
          || loadingPage
          || preview.validRows <= 0
        "
        @click="emit('confirm')"
      >
        {{
          importing
            ? "Importing..."
            : `Import ${preview.validRows} Valid Rows`
        }}
      </Button>
    </div>
    </div>
  </div>
</template>