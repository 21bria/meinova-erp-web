<script setup lang="ts">
import {
  computed,
  ref,
} from "vue"

import AttendanceForm from "./forms/AttendanceForm.vue"
import AttendanceHeader from "./AttendanceHeader.vue"
import AttendanceOverview from "./AttendanceOverview.vue"
import AttendanceTabs from "./AttendanceTabs.vue"

import { resourceLabel } from "@framework"

import InlineResource from "../shared/workspace-resource/InlineResource.vue"
import WorkspaceResource from "../shared/workspace-resource/WorkspaceResource.vue"

import type {
  ColumnDef,
} from "@tanstack/vue-table"

import {
  column,
  createColumns,
  MWorkspaceHistory,
  normalizeResourceFields,
} from "@framework"

import type {
  CrudColumn,
  FormField,
} from "@framework"

import {
  attendanceOverviewItems,
  attendanceWorkspaceDefaultTab,
  attendanceWorkspaceTabs,
} from "../workspace"

import type {
  AttendancePayload,
  AttendanceRow,
} from "../types"

import type {
  AttendanceWorkspaceMode,
  AttendanceWorkspaceTab,
} from "../composables/useAttendanceWorkspace"

const props = withDefaults(
  defineProps<{
    modelValue: Record<string, any>

    mode: Exclude<
      AttendanceWorkspaceMode,
      "list"
    >

    record?: AttendanceRow | null
    recordId?: string | number

    loading?: boolean
    saving?: boolean

    errors?: Record<string, any> | null
    validationVersion?: number

    canSave?: boolean
    canEdit?: boolean
    canDelete?: boolean
  }>(),
  {
    modelValue: () => ({}),

    record: null,
    recordId: undefined,

    loading: false,
    saving: false,

    errors: null,
    validationVersion: 0,

    canSave: true,
    canEdit: true,
    canDelete: true,
  },
)

const emit = defineEmits<{
  "update:modelValue": [
    value: Record<string, any>,
  ]

  back: []

  save: [
    payload: AttendancePayload,
  ]

  saveAndNew: [
    payload: AttendancePayload,
  ]

  saveAndClose: [
    payload: AttendancePayload,
  ]

  edit: [
    record: AttendanceRow,
  ]

  delete: [
    record: AttendanceRow,
  ]

  refresh: []
}>()

/*
|--------------------------------------------------------------------------
| Workspace state
|--------------------------------------------------------------------------
*/

const activeTab = ref(
  attendanceWorkspaceDefaultTab,
)

const tabs = computed<
  AttendanceWorkspaceTab[]
>(() => {
  return Array.isArray(
    attendanceWorkspaceTabs,
  )
    ? attendanceWorkspaceTabs.map(localizeTab)
    : []
})

/*
| Label tab + label field grid, diterjemahkan saat render.
|
| `attendanceWorkspaceTabs` adalah `const` tingkat module: isinya dihitung
| sekali saat chunk dimuat, dan pada saat itu instance i18n belum tentu
| terpasang. Generator karena itu hanya menitipkan `labelKey`; yang
| menerjemahkan komputasi ini, yang jalan tiap kali bahasa berubah.
|
| Tanpa `labelKey`, `label` dipakai apa adanya — modul yang belum
| memakai namespace i18n tidak berubah sama sekali.
*/
function localizeLabel(node: any) {
  if (!node?.labelKey)
    return node

  return { ...node, label: resourceLabel(node.labelKey, node.label ?? "") }
}

function localizeTab(tab: any) {
  const localized: any = localizeLabel(tab)

  if (!Array.isArray(localized.fields))
    return localized

  return {
    ...localized,
    fields: localized.fields.map(
      (item: any) => (item && typeof item === "object" ? localizeLabel(item) : item),
    ),
  }
}

/*
|--------------------------------------------------------------------------
| Model
|--------------------------------------------------------------------------
|
| Page.vue menjadi satu-satunya sumber data form.
| Workspace hanya membaca dan mengirim perubahan melalui v-model.
|
| Tidak ada local model, deep watch, atau sinkronisasi ganda.
|
*/

const model = computed<
  Record<string, any>
>({
  get() {
    return props.modelValue
  },

  set(value) {
    emit(
      "update:modelValue",
      value,
    )
  },
})

/*
|--------------------------------------------------------------------------
| Form update
|--------------------------------------------------------------------------
*/

function updateModel(
  value: Record<string, any>,
) {
  model.value = {
    ...model.value,
    ...value,
  }
}

/*
|--------------------------------------------------------------------------
| Resource helpers
|--------------------------------------------------------------------------
*/

/*
| Tab resource membawa konfigurasi field **mentah** dari backend
| (snake_case), sedangkan `MFormBuilder` membaca bentuk camelCase.
| Tanpa pemetaan ini dropdown lookup di dalam tab tidak pernah punya
| sumber data, kolom read-only tetap bisa diketik, dan `visible_when`
| diabaikan — seluruh field usulan tampil sekaligus.
|
| Kolom induk ikut dibuang: induknya sudah ditentukan tab yang sedang
| dibuka.
*/
function getResourceSchema(
  tab: AttendanceWorkspaceTab,
): FormField[] {
  return normalizeResourceFields(
    tab.fields,
    { parentField: tab.foreignKey },
  )
}

function getResourceColumns(
  tab: AttendanceWorkspaceTab,
): ColumnDef<Record<string, any>, any>[] {
  const schema =
    getResourceSchema(tab)

  const configuredFields =
    schema.filter(
      field =>
        (field as any).table === true,
    )

  const visibleFields =
    configuredFields.length > 0
      ? configuredFields
      : schema
          .filter((field) => {
            return ![
              "textarea",
              "file",
              "image",
              "password",
            ].includes(
              String(field.type),
            )
          })
          .slice(0, 5)

  const items = visibleFields.map((field) => {
    const fieldKey =
      String(field.key)

    const displayKey =
      String(
        (field as any).displayKey
        ?? fieldKey,
      )

    const label =
      String(
        field.label
        ?? fieldKey,
      )

    const sortable =
      (field as any).sortable === true

    const orderingKey =
      String(
        (field as any).orderingKey
        ?? (field as any).ordering_key
        ?? (
          field.type === "lookup"
            ? `${fieldKey}__name`
            : fieldKey
        ),
      )

    /*
     * `CrudColumn`, bukan `ColumnDef`. Dua kosakata kolom yang gampang
     * tertukar: `column.*()` menghasilkan `CrudColumn` (deskripsi
     * kolom), dan `createColumns()` yang menerjemahkannya jadi
     * `ColumnDef` milik TanStack. Menyalahkan tipenya di sini menyeret
     * `column.text<T>(key: keyof T & string)` ke `T = unknown`, jadi
     * parameternya menyempit jadi `never` dan setiap pemanggilannya
     * ikut jadi error — satu anotasi salah, sepuluh error per module.
     */
    let definition:
      CrudColumn<Record<string, any>>

    if (
      field.type === "boolean"
      || field.type === "switch"
      || field.type === "checkbox"
    ) {
      definition = column.status(
        fieldKey,
        label,
      )
    }
    else if (
      field.type === "number"
      || field.type === "currency"
    ) {
      definition = column.number(
        fieldKey,
        label,
      )
    }
    else {
      definition = column.text(
        displayKey,
        label,
      )
    }

    return {
      ...definition,

      /*
       * ID dipakai oleh event sorting.
       * accessorKey tetap dipakai untuk data tabel.
       */
      id: orderingKey,

      enableSorting: sortable,
    }
  })

  return createColumns<
    Record<string, any>
  >({
    selectable: false,
    canMutate: false,
    actions: {},
    items,
  })
}
  
/*
|--------------------------------------------------------------------------
| Payload normalization
|--------------------------------------------------------------------------
*/

function normalizePayload(
  value: Record<string, any>,
): AttendancePayload {
  const payload: Record<string, any> = {}

  for (
    const [key, raw]
    of Object.entries(value)
  ) {
    if (
      raw
      && typeof raw === "object"
      && !Array.isArray(raw)
      && (
        "id" in raw
        || "value" in raw
      )
    ) {
      payload[key] =
        raw.id
        ?? raw.value
        ?? null

      continue
    }

    if (typeof raw === "string") {
      payload[key] = raw.trim()
      continue
    }

    payload[key] = raw
  }

  return payload as AttendancePayload
}

/*
|--------------------------------------------------------------------------
| Submit
|--------------------------------------------------------------------------
*/

function submit(
  action:
    | "save"
    | "saveAndNew"
    | "saveAndClose",
) {
  const payload =
    normalizePayload(model.value)

  if (action === "save") {
    emit("save", payload)
    return
  }

  if (action === "saveAndNew") {
    emit("saveAndNew", payload)
    return
  }

  emit("saveAndClose", payload)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <AttendanceHeader
      :mode="mode"
      :record="record"
      :record-id="recordId"
      :loading="loading"
      :saving="saving"
      :can-save="canSave"
      :can-edit="canEdit"
      :can-delete="canDelete"
      @back="emit('back')"
      @edit="value => emit('edit', value)"
      @delete="value => emit('delete', value)"
      @refresh="emit('refresh')"
      @save="submit('save')"
      @save-and-new="
        submit('saveAndNew')
      "
      @save-and-close="
        submit('saveAndClose')
      "
    />

    <AttendanceOverview
      v-if="mode !== 'create'"
      :mode="mode"
      :record="record"
      :record-id="recordId"
      :items="attendanceOverviewItems"
      :loading="loading"
    />

    <AttendanceTabs
      v-model:active-tab="activeTab"
      :mode="mode"
      :record="record"
      :record-id="recordId"
      :tabs="tabs"
      :loading="loading"
      :errors="errors"
      :validation-version="
        validationVersion
      "
    >
     <template
        v-for="tab in tabs"
        :key="tab.key"
        #[tab.key]
      >
        <AttendanceForm
          v-if="tab.type === 'form'"
          :key="tab.key"
          :model-value="model"
          :mode="mode"
          :tab-key="tab.key"
          :fields="tab.fields"
          :readonly="tab.readonly"
          :loading="loading"
          :errors="errors"
          @update:model-value="updateModel"
        />

        <InlineResource
          v-if="
            tab.type === 'resource'
            && tab.inline === true
            && recordId != null
          "
          :title="tab.label"
          :endpoint="tab.endpoint ?? ''"
          :parent-field="
            tab.foreignKey ?? ''
          "
          :parent-id="recordId"
          :can-create="tab.canCreate !== false"
          :schema="
            getResourceSchema(tab)
          "
        />

        <WorkspaceResource
          v-if="
            tab.type === 'resource'
            && tab.inline !== true
            && recordId != null
          "
          :title="tab.label"
          :endpoint="tab.endpoint ?? ''"
          :parent-field="
            tab.foreignKey ?? ''
          "
          :parent-id="recordId"
          :columns="
            getResourceColumns(tab)
          "
          :schema="
            getResourceSchema(tab)
          "
        />

        <div
          v-if="
            tab.type === 'resource'
            && recordId == null
          "
          class="
            flex min-h-40 items-center
            justify-center rounded-md
            border border-dashed
          "
        >
          <p class="text-sm text-muted-foreground">
            Save this record before adding
            {{ tab.label.toLowerCase() }}.
          </p>
        </div>

        <!--
        | Tab riwayat. Dulu ikut jatuh ke slot di bawah yang tidak
        | pernah diisi `page.vue`, jadi tabnya menampilkan "belum
        | tersambung" walau endpoint-nya jalan. Komponennya generik —
        | yang membedakan antar modul cuma `endpoint` di schema.
        -->
        <MWorkspaceHistory
          v-if="tab.type === 'history' && recordId != null"
          :title="tab.label"
          :endpoint="tab.endpoint ?? ''"
          :record-id="recordId"
        />

        <slot
          v-if="
            tab.type !== 'form'
            && tab.type !== 'resource'
            && tab.type !== 'history'
          "
          :name="tab.key"
          :tab="tab"
          :mode="mode"
          :record="record"
          :record-id="recordId"
        />
      </template>
    </AttendanceTabs>
  </div>
</template>