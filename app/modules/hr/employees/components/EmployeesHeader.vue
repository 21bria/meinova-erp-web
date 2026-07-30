<script setup lang="ts">
import {
  ArrowLeft,
  CopyPlus,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-vue-next"

import type {
  EmployeesRow,
} from "../types"

export type EmployeesWorkspaceMode =
  | "create"
  | "edit"
  | "detail"

const props = withDefaults(
  defineProps<{
    mode: EmployeesWorkspaceMode
    record?: EmployeesRow | null
    recordId?: string
    title?: string
    subtitle?: string
    status?: string
    loading?: boolean
    saving?: boolean
    canEdit?: boolean
    canDelete?: boolean
    canSave?: boolean
  }>(),
  {
    record: null,
    recordId: undefined,
    title: "",
    subtitle: "",
    status: "",
    loading: false,
    saving: false,
    canEdit: true,
    canDelete: true,
    canSave: true,
  },
)

const emit = defineEmits<{
  back: []
  edit: [record: EmployeesRow]
  delete: [record: EmployeesRow]
  refresh: []
  save: []
  saveAndNew: []
  saveAndClose: []
}>()

const isCreateMode = computed(
  () => props.mode === "create",
)

const isEditMode = computed(
  () => props.mode === "edit",
)

const isDetailMode = computed(
  () => props.mode === "detail",
)

const displayTitle = computed(() => {
  if (props.title)
    return props.title

  if (isCreateMode.value)
    return "Create Employees"

  if (!props.record)
    return isEditMode.value
      ? "Edit Employees"
      : "Employees"

  return String(
    props.record.display_name
      ?? props.record.name
      ?? props.record.code
      ?? props.record.id
      ?? "Employees",
  )
})

const displaySubtitle = computed(() => {
  if (props.subtitle)
    return props.subtitle

  if (isCreateMode.value)
    return "Create a new record"

  if (!props.record)
    return props.recordId
      ? `ID: ${props.recordId}`
      : ""

  const code = props.record.code

  if (code != null)
    return String(code)

  if (props.record.id != null)
    return `ID: ${props.record.id}`

  return ""
})

const disableActions = computed(
  () => props.loading || props.saving,
)

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
            v-if="status && !isCreateMode"
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

    <div class="flex flex-wrap items-center gap-2">
      <!-- Create / Edit actions -->
      <template v-if="isCreateMode || isEditMode">
        <Button
          v-if="canSave"
          type="button"
          size="sm"
          :disabled="disableActions"
          @click="emit('save')"
        >
          <Save class="mr-2 size-4" />
          {{ saving ? "Saving..." : "Save" }}
        </Button>

        <Button
          v-if="canSave"
          type="button"
          variant="outline"
          size="sm"
          :disabled="disableActions"
          @click="emit('saveAndNew')"
        >
          <CopyPlus class="mr-2 size-4" />
          Save & New
        </Button>

        <Button
          v-if="canSave"
          type="button"
          variant="outline"
          size="sm"
          :disabled="disableActions"
          @click="emit('saveAndClose')"
        >
          <Save class="mr-2 size-4" />
          Save & Close
        </Button>
      </template>

      <!-- Detail actions -->
      <template v-if="isDetailMode">
        <Button
          type="button"
          variant="outline"
          size="sm"
          :disabled="disableActions"
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
          :disabled="!record || disableActions"
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
          :disabled="!record || disableActions"
          @click="handleDelete"
        >
          <Trash2 class="mr-2 size-4" />
          Delete
        </Button>
      </template>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            type="button"
            variant="outline"
            size="icon"
            :disabled="disableActions"
          >
            <MoreHorizontal class="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            v-if="!isCreateMode"
            @click="emit('refresh')"
          >
            Refresh
          </DropdownMenuItem>

          <DropdownMenuItem
            @click="emit('back')"
          >
            Back to list
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>