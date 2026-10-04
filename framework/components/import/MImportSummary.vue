<script setup lang="ts">
import { formatLocaleNumber } from "../../core/utils/i18n"

import {
  CircleCheckBig,
  CircleX,
  FileSpreadsheet,
  UserRoundX,
} from "lucide-vue-next"

import type {
  ImportPreviewResult,
} from "../../core/types/import"

const props = defineProps<{
  preview: ImportPreviewResult
}>()

const validPercent = computed(() => {
  if (!props.preview.totalRows)
    return 0

  return Math.round(
    (props.preview.validRows / props.preview.totalRows) * 100,
  )
})

const invalidPercent = computed(() => {
  return 100 - validPercent.value
})

const items = computed(() => [
  {
    label: "Total Rows",
    value: props.preview.totalRows,
    icon: FileSpreadsheet,
    color: "text-primary",
    description: "Records found in file",
  },

  {
    label: "Valid Rows",
    value: props.preview.validRows,
    icon: CircleCheckBig,
    color: "text-emerald-600",
    description: `${validPercent.value}% ready to import`,
  },

  {
    label: "Invalid Rows",
    value: props.preview.invalidRows,
    icon: CircleX,
    color: "text-red-600",
    description: `${invalidPercent.value}% require attention`,
  },

  {
    label: "Employee Not Found",
    value: props.preview.unmatchedRows ?? 0,
    icon: UserRoundX,
    color: "text-orange-500",
    description: "Employee not matched",
  },
])
</script>

<template>
  <div class="space-y-3">

    <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <Card v-for="item in items" :key="item.label" class="transition-all hover:shadow-md">
        <CardContent class="p-4">

          <div class="flex items-start justify-between">

            <div>

              <p class="text-sm text-muted-foreground">
                {{ item.label }}
              </p>

              <h2 class="mt-1 text-2xl font-bold">
                {{ formatLocaleNumber(Number(item.value)) }}
              </h2>

              <p class="mt-1 text-xs text-muted-foreground">
                {{ item.description }}
              </p>

            </div>

            <component :is="item.icon" class="h-7 w-7" :class="item.color" />

          </div>

        </CardContent>
      </Card>
    </div>

   

     <div class="space-y-2 p-3">
        <div class="flex items-center justify-between text-sm">
          <span>
            Import Quality
          </span>
         <span class="font-semibold">
            {{ validPercent }}%
          </span>
        </div>

        <Progress class="mt-2 h-2" :model-value="validPercent" />
         <div
            class="
              mt-2 flex items-center
              justify-between text-xs
              text-muted-foreground
            "
          >
          <span>
            {{ props.preview.validRows }} Valid
          </span>
          <span>
            {{ props.preview.invalidRows }} Invalid
          </span>
        </div>
      </div>


  </div>
</template>