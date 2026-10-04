<script setup lang="ts">
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  CircleHelp,
  Clock3,
  FileWarning,
  UserRound,
  XCircle,
} from "lucide-vue-next"

import type {
  ImportPreviewColumn,
  ImportPreviewRow,
} from "../../core/types/import"

const props = defineProps<{
  columns: ImportPreviewColumn[]
  rows: ImportPreviewRow[]
  loading?: boolean
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

/*
 * Seluruh pesan ditampilkan, bukan cuma yang pertama: satu baris bisa
 * gagal karena beberapa kolom sekaligus, dan menyembunyikan sisanya
 * membuat user memperbaiki file berkali-kali.
 */
function rowErrors(
  row: ImportPreviewRow,
): string[] {
  if (!row.errors)
    return []

  const messages: string[] = []

  for (
    const value
    of Object.values(row.errors)
  ) {
    if (Array.isArray(value)) {
      messages.push(
        ...value.map(String),
      )
      continue
    }

    if (
      value !== null
      && value !== undefined
      && value !== ""
    ) {
      messages.push(String(value))
    }
  }

  return messages
}

function rowKey(
  row: ImportPreviewRow,
  index: number,
) {
  return (
    row.row_number
    ?? row.rowNumber
    ?? index
  )
}

function normalizeType(
  value: unknown,
) {
  return String(
    value ?? "unknown",
  )
    .trim()
    .toLowerCase()
}

function formatDateTime(
  value: unknown,
) {
  if (
    value === undefined
    || value === null
    || value === ""
  ) {
    return "-"
  }

  const date = new Date(
    String(value),
  )

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return String(value)
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  ).format(date)
}

function isEmployeeColumn(
  key: string,
) {
  return [
    "employee_name",
    "employeeName",
  ].includes(key)
}

function isEmployeeCodeColumn(
  key: string,
) {
  return [
    "employee_code",
    "employeeCode",
  ].includes(key)
}

function isDateTimeColumn(
  key: string,
) {
  return [
    "log_time",
    "logTime",
    "attendance_date",
    "attendanceDate",
    "check_in",
    "checkIn",
    "check_out",
    "checkOut",
  ].includes(key)
}

function isTypeColumn(
  key: string,
) {
  return [
    "log_type",
    "logType",
    "type",
  ].includes(key)
}
</script>

<template>
  <div class="
      overflow-hidden rounded-xl
      border bg-background
    ">
    <div class="
        flex flex-col gap-2
        border-b px-5 py-3
        sm:flex-row
        sm:items-center
        sm:justify-between
      ">
      <div>
        <h2 class="font-semibold">
          Preview Rows
        </h2>

        <p class="mt-0.5 text-xs text-muted-foreground">
          Review normalized data before
          confirming the import.
        </p>
      </div>

      <Badge variant="outline">
        {{ rows.length }} Rows
      </Badge>
    </div>

    <div v-if="loading" class="flex min-h-[220px] items-center justify-center gap-2 text-muted-foreground">
      <Clock3 class="h-4 w-4 animate-pulse" />
      Loading preview rows...
    </div>

    <div v-else class="max-h-[620px] overflow-auto">
      <table class="w-full min-w-[980px] text-sm">
        <thead class="
            sticky top-0 z-10
            border-b bg-background/95
            backdrop-blur
          ">
          <tr>
            <th v-for="column in columns" :key="column.key" class="
                whitespace-nowrap
                px-4 py-2.5
                text-xs font-semibold
                text-muted-foreground
              " :class="{
                'text-left':
                  !column.align
                  || column.align === 'left',

                'text-center':column.align === 'center',

                'text-right':column.align === 'right',
              }" :style="{
                width:
                  column.width
                  ?? undefined,
              }">
              {{ column.label }}
            </th>

            <th class="
                w-[240px]
                whitespace-nowrap
                px-4 py-2.5
                text-left text-xs
                font-semibold
                text-muted-foreground
              ">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, index) in rows" :key="rowKey(row, index)" class="
              border-b
              transition-colors
              odd:bg-muted/10
              hover:bg-muted/30
              last:border-b-0
            ">
            <td v-for="column in columns" :key="column.key" class="
                px-4 py-2.5
                align-middle
              " :class="{
                'text-left':
                  !column.align
                  || column.align === 'left',

                'text-center':column.align === 'center',

                'text-right':column.align === 'right',
              }">
              <template v-if="isEmployeeColumn(column.key,)">
                <div class="flex min-w-[180px] items-center gap-2">
                  <div class="
                      flex h-7 w-7
                      shrink-0 items-center
                      justify-center
                      rounded-full
                      bg-muted
                    ">
                    <UserRound class="h-3.5 w-3.5 text-muted-foreground" />
                  </div>

                  <span class="truncate text-sm font-medium">
                    {{displayValue(row,column,)}}
                  </span>
                </div>
              </template>

              <template v-else-if="isEmployeeCodeColumn(column.key,)">
                <span class="font-mono text-sm font-medium">
                  {{displayValue(row,column,)}}
                </span>
              </template>

              <template v-else-if="isDateTimeColumn(column.key,)">
                <div class="flex items-center gap-2 whitespace-nowrap">
                  <Clock3 class="h-3.5 w-3.5 text-muted-foreground"/>
                  <span class="text-sm font-medium">{{formatDateTime(row[column.key],)}}
                  </span>
                </div>
              </template>

              <template v-else-if="isTypeColumn(column.key,)">
                <Badge v-if="
                  normalizeType(
                    row[column.key],
                  ) === 'in'
                " variant="outline" class="
                    border-emerald-200
                    bg-emerald-50
                    text-emerald-700
                    dark:border-emerald-900
                    dark:bg-emerald-950/40
                    dark:text-emerald-400
                  ">
                  <ArrowDownToLine class="mr-1 h-3 w-3"/>
                  IN
                </Badge>

                <Badge v-else-if="
                  normalizeType(
                    row[column.key],
                  ) === 'out'
                " variant="outline" class="
                    border-orange-200
                    bg-orange-50
                    text-orange-700
                    dark:border-orange-900
                    dark:bg-orange-950/40
                    dark:text-orange-400
                  ">
                  <ArrowUpFromLine class="mr-1 h-3 w-3"/>
                  OUT
                </Badge>

                <Badge v-else variant="secondary">
                  <CircleHelp class="mr-1 h-3 w-3"/>
                  UNKNOWN
                </Badge>
              </template>

              <template v-else>
                <span class="whitespace-nowrap">
                  {{displayValue(row,column)}}
                </span>
              </template>
            </td>

            <td class="px-4 py-2.5">
              <div class="flex min-w-[220px] items-start gap-2">
                <CheckCircle2 v-if="row.valid" class="
                    mt-0.5 h-4 w-4
                    shrink-0
                    text-emerald-600
                  " />

                <XCircle v-else class="
                    mt-0.5 h-4 w-4
                    shrink-0
                    text-destructive
                  " />

                <div class="min-w-0">
                  <Badge :variant="row.valid? 'secondary': 'destructive'">
                    {{row.valid? "Valid": "Invalid"}}
                  </Badge>

                  <ul v-if="!row.valid && rowErrors(row).length"
                   class="mt-1 max-w-[260px] space-y-0.5 text-xs leading-relaxed text-destructive">
                    <li v-for="(message, messageIndex) in rowErrors(row)" :key="messageIndex">
                      {{ message }}
                    </li>
                  </ul>
                </div>
              </div>
            </td>
          </tr>

          <tr v-if="rows.length === 0">
            <td :colspan="columns.length + 1
              " class="
                px-4 py-14
                text-center
                text-muted-foreground
              ">
              <div class="
                  flex flex-col
                  items-center gap-2
                ">
                <FileWarning class="
                    h-8 w-8
                    opacity-60
                  " />

                <span>
                  No preview rows available.
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>