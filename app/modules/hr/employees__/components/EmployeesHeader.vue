<script setup lang="ts">
import {
  ArrowLeft,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-vue-next"

import type {
  EmployeesRow,
} from "../types"

const props = withDefaults(
  defineProps<{
    record: EmployeesRow | null
    title?: string
    subtitle?: string
    status?: string
    loading?: boolean
    canEdit?: boolean
    canDelete?: boolean
  }>(),
  {
    title: "",
    subtitle: "",
    status: "",
    loading: false,
    canEdit: true,
    canDelete: true,
  },
)

const emit = defineEmits<{
  back: []
  edit: [record: EmployeesRow]
  delete: [record: EmployeesRow]
  refresh: []
}>()

const displayTitle = computed(() => {
  if (props.title)
    return props.title

  if (!props.record)
    return "Employees"

  return String(
    props.record.name
      ?? props.record.code
      ?? props.record.id
      ?? "Employees",
  )
})

const displaySubtitle = computed(() => {
  if (props.subtitle)
    return props.subtitle

  if (!props.record)
    return ""

  const code = props.record.code

  if (code != null)
    return String(code)

  if (props.record.id != null)
    return `ID: ${props.record.id}`

  return ""
})

function handleEdit() {
  if (!props.record)
    return

  emit("edit", props.record)
}

function handleDelete() {
  if (!props.record)
    return

  emit("delete", props.record)
}
</script>

<template>
  <div
    class="flex flex-col gap-4 rounded-lg border bg-background p-5 md:flex-row md:items-center md:justify-between"
  >
    <div class="flex min-w-0 items-start gap-3">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="shrink-0"
        @click="emit('back')"
      >
        <ArrowLeft class="size-4" />
      </Button>

      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <Skeleton
            v-if="loading"
            class="h-7 w-52"
          />

          <h1
            v-else
            class="truncate text-xl font-semibold tracking-tight"
          >
            {{ displayTitle }}
          </h1>

          <Badge
            v-if="status"
            variant="secondary"
          >
            {{ status }}
          </Badge>
        </div>

        <Skeleton
          v-if="loading"
          class="mt-2 h-4 w-36"
        />

        <p
          v-else-if="displaySubtitle"
          class="mt-1 truncate text-sm text-muted-foreground"
        >
          {{ displaySubtitle }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        :disabled="loading"
        @click="emit('refresh')"
      >
        <RefreshCw class="mr-2 size-4" />
        Refresh
      </Button>

      <Button
        v-if="canEdit"
        type="button"
        variant="outline"
        size="sm"
        :disabled="!record || loading"
        @click="handleEdit"
      >
        <Pencil class="mr-2 size-4" />
        Edit
      </Button>

      <Button
        v-if="canDelete"
        type="button"
        variant="destructive"
        size="sm"
        :disabled="!record || loading"
        @click="handleDelete"
      >
        <Trash2 class="mr-2 size-4" />
        Delete
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            type="button"
            variant="outline"
            size="icon"
            :disabled="loading"
          >
            <MoreHorizontal class="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="emit('refresh')">
            Refresh
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>