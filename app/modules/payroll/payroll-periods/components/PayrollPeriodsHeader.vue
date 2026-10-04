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

import {
  MRecordActions,
} from "@framework"

import {
  payrollPeriodsRecordActions,
} from "../actions"

import type {
  PayrollPeriodsRow,
} from "../types"

import type {
  PayrollPeriodsWorkspaceMode,
} from "../composables/usePayrollPeriodsWorkspace"

const props = withDefaults(
  defineProps<{
    mode: PayrollPeriodsWorkspaceMode
    record?: PayrollPeriodsRow | null
    recordId?: string | number
    title?: string
    subtitle?: string
    status?: string
    loading?: boolean
    saving?: boolean
    canEdit?: boolean
    canDelete?: boolean
    canSave?: boolean
    canRefresh?: boolean
    showSaveAndNew?: boolean
    showSaveAndClose?: boolean
    showMoreActions?: boolean
    showRecordActions?: boolean
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
    canRefresh: true,
    showSaveAndNew: true,
    showSaveAndClose: true,
    showMoreActions: true,
    showRecordActions: true,
  },
)

const emit = defineEmits<{
  back: []
  edit: [record: PayrollPeriodsRow]
  delete: [record: PayrollPeriodsRow]
  refresh: []
  save: []
  saveAndNew: []
  saveAndClose: []
}>()

/*
| Record action dari `schema.actions` — Submit, Approve, Reject, dan
| tombol khusus modul lain. Daftarnya digenerate ke `actions.ts`; modul
| yang schema-nya tidak mendeklarasikan apa pun mendapat array kosong
| dan tidak merender apa-apa.
|
| Halaman ini tidak tahu satu pun nama actionnya. Yang menentukan URL,
| syarat tampil, dan kalimat konfirmasinya adalah schema backend.
*/
function handleRecordActionDone(action: any) {
  if (action?.refresh !== false)
    emit("refresh")
}

const isCreateMode = computed(
  () => props.mode === "create",
)

const isEditMode = computed(
  () => props.mode === "edit",
)

const isDetailMode = computed(
  () => props.mode === "detail",
)

const isFormMode = computed(
  () =>
    isCreateMode.value
    || isEditMode.value,
)

/*
 * Judul dan subjudul dirakit dari kolom yang **kebetulan** dimiliki
 * baris ini — `display_name`, `name`, `code`, `employee_number`. Tidak
 * ada satu pun yang wajib, dan tiap resource membawa kombinasi berbeda,
 * jadi membacanya lewat tipe barisnya berarti setiap module yang tidak
 * punya `code` melaporkan error untuk fallback yang memang sengaja
 * dituliskan. Satu alias longgar di sini, bukan `as any` bertaburan di
 * setiap pembacaan.
 */
const displayRow = computed<Record<string, any>>(
  () => (props.record ?? {}) as Record<string, any>,
)

const displayTitle = computed(() => {
  if (props.title)
    return props.title

  if (isCreateMode.value)
    return "Create PayrollPeriods"

  if (!props.record) {
    return isEditMode.value
      ? "Edit PayrollPeriods"
      : "PayrollPeriods"
  }

  return String(
    displayRow.value.display_name
      ?? displayRow.value.name
      ?? displayRow.value.code
      ?? displayRow.value.id
      ?? "PayrollPeriods",
  )
})

const displaySubtitle = computed(() => {
  if (props.subtitle)
    return props.subtitle

  if (isCreateMode.value)
    return "Create a new record"

  if (!props.record) {
    return props.recordId != null
      ? `ID: ${props.recordId}`
      : ""
  }

  const code =
    displayRow.value.code
    ?? displayRow.value.employee_number
    ?? null

  if (code != null)
    return String(code)

  if (displayRow.value.id != null)
    return `ID: ${displayRow.value.id}`

  return ""
})

const displayStatus = computed(() => {
  if (props.status)
    return props.status

  if (!props.record)
    return ""

  const status =
    displayRow.value.status
    ?? displayRow.value.employment_status
    ?? null

  if (status != null)
    return String(status)

  if ("is_active" in displayRow.value) {
    return displayRow.value.is_active
      ? "Active"
      : "Inactive"
  }

  return ""
})

const disableActions = computed(
  () =>
    props.loading
    || props.saving,
)

function handleEdit() {
  if (
    !props.record
    || !props.canEdit
  ) {
    return
  }

  emit("edit", props.record)
}

function handleDelete() {
  if (
    !props.record
    || !props.canDelete
  ) {
    return
  }

  emit("delete", props.record)
}
</script>

<template>
  <div
    class="
      flex flex-col gap-4 rounded-lg
      border bg-background p-5
      md:flex-row md:items-center md:justify-between
    "
  >
    <div class="flex min-w-0 items-start gap-3">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="shrink-0"
        aria-label="Back"
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
            v-if="
              displayStatus
              && !isCreateMode
              && !loading
            "
            variant="secondary"
          >
            {{ displayStatus }}
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
      <template v-if="isFormMode">
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
          v-if="
            canSave
            && isCreateMode
            && showSaveAndNew
          "
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
          v-if="
            canSave
            && showSaveAndClose
          "
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

      <template v-if="isDetailMode">
        <Button
          v-if="canRefresh"
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

      <MRecordActions
        v-if="showRecordActions && !isCreateMode"
        :actions="payrollPeriodsRecordActions as any"
        :record="record as any"
        :mode="mode"
        :disabled="disableActions"
        @done="handleRecordActionDone"
      />

      <DropdownMenu v-if="showMoreActions">
        <DropdownMenuTrigger as-child>
          <Button
            type="button"
            variant="outline"
            size="icon"
            :disabled="disableActions"
            aria-label="More actions"
          >
            <MoreHorizontal class="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            v-if="
              !isCreateMode
              && canRefresh
            "
            @click="emit('refresh')"
          >
            <RefreshCw class="mr-2 size-4" />
            Refresh
          </DropdownMenuItem>

          <DropdownMenuItem
            @click="emit('back')"
          >
            <ArrowLeft class="mr-2 size-4" />
            Back to list
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>