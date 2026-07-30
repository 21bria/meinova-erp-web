<script setup lang="ts">
import type {
  EmployeesRow,
} from "../types"

export interface EmployeesOverviewItem {
  key: string
  label: string
  value?: unknown
  formatter?: (
    value: unknown,
    record: EmployeesRow,
  ) => string
}

const props = withDefaults(
  defineProps<{
    record: EmployeesRow | null
    items?: EmployeesOverviewItem[]
    loading?: boolean
    emptyText?: string
  }>(),
  {
    items: () => [],
    loading: false,
    emptyText: "No data available.",
  },
)

type WorkspaceRecord =
  EmployeesRow
  & Record<string, unknown>

function getValue(
  item: EmployeesOverviewItem,
) {
  if (!props.record)
    return "-"

  const record = props.record as WorkspaceRecord

  const rawValue =
    item.value !== undefined
      ? item.value
      : record[item.key]

  if (item.formatter)
    return item.formatter(rawValue, props.record)

  if (
    rawValue === null
    || rawValue === undefined
    || rawValue === ""
  ) {
    return "-"
  }

  if (typeof rawValue === "boolean")
    return rawValue ? "Yes" : "No"

  if (
    typeof rawValue === "object"
    && rawValue !== null
  ) {
    const objectValue = rawValue as Record<
      string,
      unknown
    >

    return String(
      objectValue.label
        ?? objectValue.name
        ?? objectValue.code
        ?? objectValue.id
        ?? "-",
    )
  }

  return String(rawValue)
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Overview</CardTitle>

      <CardDescription>
        General information for this record.
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
        v-else-if="record && items.length"
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
        <p class="text-sm text-muted-foreground">
          {{ emptyText }}
        </p>
      </div>
    </CardContent>
  </Card>
</template>