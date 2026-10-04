<script setup lang="ts">
import type {
  ImportPreviewColumn,
  ImportPreviewRow,
} from "../../core/types/import"

const props = defineProps<{
  columns: ImportPreviewColumn[]
  rows: ImportPreviewRow[]
}>()

function displayValue(
  row: ImportPreviewRow,
  column: ImportPreviewColumn,
) {
  const value = row[column.key]

  if (column.formatter) {
    return column.formatter(
      value,
      row,
    )
  }

  if (
    value === undefined
    || value === null
    || value === ""
  ) {
    return "-"
  }

  return String(value)
}

function firstRowError(
  row: ImportPreviewRow,
) {
  if (!row.errors)
    return null

  for (
    const messages
    of Object.values(row.errors)
  ) {
    if (
      Array.isArray(messages)
      && messages.length > 0
    ) {
      return messages[0]
    }
  }

  return null
}
</script>

<template>
  <div
    class="
      overflow-hidden rounded-xl
      border bg-background
    "
  >
    <div class="border-b px-5 py-4">
      <h2 class="font-semibold">
        Preview Rows
      </h2>

      <p
        class="
          mt-1 text-sm
          text-muted-foreground
        "
      >
        Review normalized data before
        confirming the import.
      </p>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[900px] text-sm">
        <thead class="border-b bg-muted/40">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3 font-medium"
              :class="{
                'text-left':
                  !column.align
                  || column.align === 'left',

                'text-center':
                  column.align === 'center',

                'text-right':
                  column.align === 'right',
              }"
            >
              {{ column.label }}
            </th>

            <th
              class="
                px-4 py-3 text-left
                font-medium
              "
            >
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, index) in rows"
            :key="
              row.row_number
              ?? row.rowNumber
              ?? index
            "
            class="
              border-b last:border-b-0
              hover:bg-muted/20
            "
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3"
              :class="{
                'text-left':
                  !column.align
                  || column.align === 'left',

                'text-center':
                  column.align === 'center',

                'text-right':
                  column.align === 'right',
              }"
            >
              {{
                displayValue(
                  row,
                  column,
                )
              }}
            </td>

            <td class="px-4 py-3">
              <div class="space-y-1">
                <Badge
                  :variant="
                    row.valid
                      ? 'secondary'
                      : 'destructive'
                  "
                >
                  {{
                    row.valid
                      ? "Valid"
                      : "Invalid"
                  }}
                </Badge>

                <p
                  v-if="
                    !row.valid
                    && firstRowError(row)
                  "
                  class="
                    max-w-[280px]
                    text-xs text-destructive
                  "
                >
                  {{ firstRowError(row) }}
                </p>
              </div>
            </td>
          </tr>

          <tr v-if="rows.length === 0">
            <td
              :colspan="columns.length + 1"
              class="
                px-4 py-12 text-center
                text-muted-foreground
              "
            >
              No preview rows available.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>