<script setup lang="ts">
import type {
  EmployeesRow,
} from "../types"

export type EmployeesWorkspaceMode =
  | "create"
  | "edit"
  | "detail"

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
    mode?: EmployeesWorkspaceMode
    record?: EmployeesRow | null
    recordId?: string
    items?: EmployeesOverviewItem[]
    title?: string
    description?: string
    loading?: boolean
    emptyText?: string
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
  },
)

type WorkspaceRecord =
  EmployeesRow
  & Record<string, unknown>

const isCreateMode = computed(
  () => props.mode === "create",
)

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

  if (Array.isArray(rawValue)) {
    if (!rawValue.length)
      return "-"

    return rawValue
      .map((value) => {
        if (
          typeof value === "object"
          && value !== null
        ) {
          const itemValue = value as Record<string, unknown>

          return String(
            itemValue.label
              ?? itemValue.name
              ?? itemValue.code
              ?? itemValue.id
              ?? "-",
          )
        }

        return String(value)
      })
      .join(", ")
  }

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
        ?? objectValue.display_name
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
  <Card v-if="!isCreateMode">
    <CardHeader>
      <CardTitle>
        {{ title }}
      </CardTitle>

      <CardDescription>
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
        <div class="text-center">
          <p class="text-sm text-muted-foreground">
            {{ emptyText }}
          </p>

          <p
            v-if="recordId"
            class="mt-1 text-xs text-muted-foreground"
          >
            Record ID: {{ recordId }}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>