<script setup lang="ts">
import type {
  OvertimeRow,
} from "../types"

import type {
  OvertimeWorkspaceMode,
} from "../composables/useOvertimeWorkspace"

export type OvertimeOverviewFormat =
  | "text"
  | "number"
  | "date"
  | "datetime"
  | "boolean"

export interface OvertimeOverviewItem {
  key: string
  label: string

  value?: unknown
  fallback?: string
  format?: OvertimeOverviewFormat

  formatter?: (
    value: unknown,
    record: OvertimeRow,
  ) => string

  resolve?: (
    record: OvertimeRow,
  ) => unknown
}

const props = withDefaults(
  defineProps<{
    mode?: OvertimeWorkspaceMode
    record?: OvertimeRow | null
    recordId?: string | number
    items?: OvertimeOverviewItem[]
    title?: string
    description?: string
    loading?: boolean
    emptyText?: string
    showOnCreate?: boolean
  }>(),
  {
    mode: "detail",
    record: null,
    recordId: undefined,
    items: () => [],
    title: "Overview",
    description: "General information for this record.",
    loading: false,
    emptyText: "No overview data available.",
    showOnCreate: false,
  },
)

type WorkspaceRecord =
  OvertimeRow
  & Record<string, unknown>

const shouldRender = computed(() => {
  if (
    props.mode === "create"
    && !props.showOnCreate
  ) {
    return false
  }

  return true
})

function getNestedValue(
  source: Record<string, unknown>,
  path: string,
): unknown {
  return path
    .split(".")
    .filter(Boolean)
    .reduce<unknown>(
      (current, key) => {
        if (
          !current
          || typeof current !== "object"
        ) {
          return undefined
        }

        return (
          current as Record<string, unknown>
        )[key]
      },
      source,
    )
}

function formatDate(
  value: unknown,
  includeTime = false,
) {
  if (
    value === null
    || value === undefined
    || value === ""
  ) {
    return null
  }

  const date = new Date(
    value as string | number | Date,
  )

  if (Number.isNaN(date.getTime()))
    return null

  return new Intl.DateTimeFormat(
    undefined,
    includeTime
      ? {
          dateStyle: "medium",
          timeStyle: "short",
        }
      : {
          dateStyle: "medium",
        },
  ).format(date)
}

function formatNumber(
  value: unknown,
) {
  const normalized = Number(value)

  if (!Number.isFinite(normalized))
    return null

  return new Intl.NumberFormat().format(
    normalized,
  )
}

function formatObject(
  value: Record<string, unknown>,
  fallback: string,
) {
  return String(
    value.label
      ?? value.display_name
      ?? value.displayName
      ?? value.name
      ?? value.code
      ?? value.id
      ?? fallback,
  )
}

function formatArray(
  values: unknown[],
  fallback: string,
) {
  if (values.length === 0)
    return fallback

  return values
    .map((value) => {
      if (
        value
        && typeof value === "object"
      ) {
        return formatObject(
          value as Record<string, unknown>,
          fallback,
        )
      }

      return String(value)
    })
    .join(", ")
}

function formatValue(
  value: unknown,
  item: OvertimeOverviewItem,
) {
  const fallback =
    item.fallback ?? "-"

  if (
    value === null
    || value === undefined
    || value === ""
  ) {
    return fallback
  }

  if (item.format === "date") {
    return formatDate(value) ?? fallback
  }

  if (item.format === "datetime") {
    return formatDate(value, true) ?? fallback
  }

  if (item.format === "number") {
    return formatNumber(value) ?? fallback
  }

  if (
    item.format === "boolean"
    || typeof value === "boolean"
  ) {
    return value
      ? "Yes"
      : "No"
  }

  if (Array.isArray(value)) {
    return formatArray(
      value,
      fallback,
    )
  }

  if (
    typeof value === "object"
    && value !== null
  ) {
    return formatObject(
      value as Record<string, unknown>,
      fallback,
    )
  }

  return String(value)
}

function getValue(
  item: OvertimeOverviewItem,
) {
  const fallback =
    item.fallback ?? "-"

  if (!props.record)
    return fallback

  const record =
    props.record as WorkspaceRecord

  const rawValue =
    typeof item.resolve === "function"
      ? item.resolve(props.record)
      : item.value !== undefined
        ? item.value
        : getNestedValue(
            record,
            item.key,
          )

  if (item.formatter) {
    return (
      item.formatter(
        rawValue,
        props.record,
      )
      || fallback
    )
  }

  return formatValue(
    rawValue,
    item,
  )
}
</script>

<template>
  <Card v-if="shouldRender">
    <CardHeader>
      <CardTitle>
        {{ title }}
      </CardTitle>

      <CardDescription v-if="description">
        {{ description }}
      </CardDescription>
    </CardHeader>

    <CardContent>
      <div
        v-if="loading"
        class="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        <div
          v-for="index in 6"
          :key="index"
          class="space-y-2"
        >
          <Skeleton class="h-4 w-24" />
          <Skeleton class="h-5 w-40" />
        </div>
      </div>

      <div
        v-else-if="
          record
          && items.length > 0
        "
        class="grid gap-x-8 gap-y-5 md:grid-cols-2 xl:grid-cols-3"
      >
        <div
          v-for="item in items"
          :key="item.key"
          class="min-w-0"
        >
          <p class="text-sm text-muted-foreground">
            {{ item.label }}
          </p>

          <p class="mt-1 break-words text-sm font-medium">
            {{ getValue(item) }}
          </p>
        </div>
      </div>

      <div
        v-else
        class="flex min-h-32 items-center justify-center rounded-md border border-dashed"
      >
        <div class="text-center">
          <p class="text-sm text-muted-foreground">
            {{ emptyText }}
          </p>

          <p
            v-if="recordId != null"
            class="mt-1 text-xs text-muted-foreground"
          >
            Record ID: {{ recordId }}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>