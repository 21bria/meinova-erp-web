<script setup lang="ts">
import EmployeesHeader from "./components/EmployeesHeader.vue"
import EmployeesOverview from "./components/EmployeesOverview.vue"
import EmployeesTable from "./components/EmployeesTable.vue"
import EmployeesTabs from "./components/EmployeesTabs.vue"
import {employeesForm,} from "./form"

import {
  useEmployeesDetail,
} from "./composables/useEmployeesDetail"

import {
  useEmployeesWorkspace,
} from "./composables/useEmployeesWorkspace"

import type {
  EmployeesRow,
} from "./types"

type Mode =
  | "list"
  | "create"
  | "edit"
  | "detail"

type SaveAction =
  | "stay"
  | "new"
  | "close"

const props = withDefaults(
  defineProps<{
    mode?: Mode
  }>(),
  {
    mode: "list",
  },
)

const route = useRoute()
const router = useRouter()

const { request } = useApi()

const formPayload = ref<Record<string, any>>({})
const formErrors = ref<Record<string, any>>({})
const validationVersion = ref(0)
const saving = ref(false)

const recordId = computed<string | undefined>(() => {
  const value = route.params.id

  if (Array.isArray(value))
    return value[0]

  if (typeof value === "string")
    return value

  return undefined
})

const workspaceTabs = [
  {
    "key": "general",
    "label": "General",
    "type": "form",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": false,
    "showOnCreate": true,
    "order": 10
  },
  {
    "key": "organization",
    "label": "Organization",
    "type": "form",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": false,
    "showOnCreate": true,
    "order": 20
  },
  {
    "key": "employment",
    "label": "Employment",
    "type": "form",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": false,
    "showOnCreate": true,
    "order": 30
  },
  {
    "key": "payroll",
    "label": "Payroll",
    "type": "form",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": false,
    "showOnCreate": true,
    "order": 40
  },
  {
    "key": "bank",
    "label": "Bank Accounts",
    "type": "resource",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": "employee",
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "showOnCreate": false,
    "order": 50
  },
  {
    "key": "family",
    "label": "Family",
    "type": "resource",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": "employee",
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "showOnCreate": false,
    "order": 60
  },
  {
    "key": "education",
    "label": "Education",
    "type": "resource",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": "employee",
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "showOnCreate": false,
    "order": 70
  },
  {
    "key": "experience",
    "label": "Experience",
    "type": "resource",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": "employee",
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "showOnCreate": false,
    "order": 80
  },
  {
    "key": "certificate",
    "label": "Certificates",
    "type": "resource",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": "employee",
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "showOnCreate": false,
    "order": 90
  },
  {
    "key": "document",
    "label": "Documents",
    "type": "resource",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": "employee",
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "showOnCreate": false,
    "order": 100
  },
  {
    "key": "medical",
    "label": "Medical",
    "type": "resource",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": "employee",
    "component": null,
    "icon": null,
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "showOnCreate": false,
    "order": 110
  },
  {
    "key": "history",
    "label": "History",
    "type": "history",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": "EmployeesHistory",
    "icon": null,
    "readonly": true,
    "disabled": false,
    "requiresRecord": true,
    "showOnCreate": false,
    "order": 120
  },
  {
    "key": "attendance",
    "label": "Attendance",
    "type": "history",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": null,
    "icon": null,
    "readonly": true,
    "disabled": false,
    "requiresRecord": true,
    "showOnCreate": false,
    "order": 130
  },
  {
    "key": "leave",
    "label": "Leave",
    "type": "history",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": null,
    "icon": null,
    "readonly": true,
    "disabled": false,
    "requiresRecord": true,
    "showOnCreate": false,
    "order": 140
  },
  {
    "key": "training",
    "label": "Training",
    "type": "history",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": null,
    "icon": null,
    "readonly": true,
    "disabled": false,
    "requiresRecord": true,
    "showOnCreate": false,
    "order": 150
  },
  {
    "key": "activity",
    "label": "Activity",
    "type": "custom",
    "fields": null,
    "modes": null,
    "endpoint": null,
    "module": null,
    "foreignKey": null,
    "component": "EmployeesActivity",
    "icon": "activity",
    "readonly": false,
    "disabled": false,
    "requiresRecord": true,
    "showOnCreate": false,
    "order": 160
  }
]
const overviewItems: any[] =[]


const workspace = useEmployeesWorkspace({
  mode: props.mode,
  defaultTab: "general",
  tabs: workspaceTabs,
})

const detail = useEmployeesDetail()

const {
  tabs,
  activeTab,
} = workspace

const {
  record,
  pending,
} = detail

watch(
  () => props.mode,
  (mode) => {
    workspace.setMode(mode)

    if (mode === "create") {
      formPayload.value = {}
      formErrors.value = {}
      validationVersion.value = 0
    }
  },
  {
    immediate: true,
  },
)

watch(
  [
    () => props.mode,
    recordId,
  ],
  async ([mode, id]) => {
    if (
      mode === "list"
      || mode === "create"
      || !id
    ) {
      detail.clearRecord()
      workspace.setRecord(null)

      if (mode === "create") {
        formPayload.value = {}
        formErrors.value = {}
      }

      return
    }

    try {
      const currentRecord = await detail.fetchDetail(id)

      workspace.setRecord(currentRecord)

      formPayload.value = {
        ...currentRecord,
      }

      formErrors.value = {}
    }
    catch {
      workspace.setRecord(null)
      formPayload.value = {}
    }
  },
  {
    immediate: true,
  },
)

function handleFormChange(
  payload: Record<string, any>,
) {
  formPayload.value = {
    ...payload,
  }

  const nextErrors = {
    ...formErrors.value,
  }

  for (const key of Object.keys(nextErrors)) {
    if (!(key in payload))
      continue

    const value = payload[key]

    if (
      value !== undefined
      && value !== null
      && value !== ""
      && (
        !Array.isArray(value)
        || value.length > 0
      )
    ) {
      delete nextErrors[key]
    }
  }

  formErrors.value = nextErrors
}

function extractApiErrors(
  error: any,
): Record<string, any> {
  return (
    error?.data?.errors
    ?? error?.response?._data?.errors
    ?? error?.response?.data?.errors
    ?? error?.errors
    ?? {}
  )
}

function handleBack() {
  router.push("/hr/employees")
}

function handleEdit(
  currentRecord: EmployeesRow,
) {
  if (currentRecord.id == null)
    return

  router.push(
    `/hr/employees/${currentRecord.id}/edit`,
  )
}

async function handleRefresh() {
  const id = recordId.value

  if (!id)
    return

  try {
    const currentRecord = await detail.fetchDetail(id)

    workspace.setRecord(currentRecord)

    formPayload.value = {
      ...currentRecord,
    }

    formErrors.value = {}
  }
  catch {
    workspace.setRecord(null)
  }
}

function handleDelete(
  currentRecord: EmployeesRow,
) {
  if (currentRecord.id == null)
    return

  // Sambungkan ke dialog konfirmasi delete.
}
function isEmptyValue(value: unknown) {
  return (
    value === undefined
    || value === null
    || value === ""
    || (
      Array.isArray(value)
      && value.length === 0
    )
  )
}

function validateRequiredFields() {
  const errors: Record<string, string[]> = {}

  const fields = Array.isArray(employeesForm)
    ? employeesForm
    : employeesForm.fields ?? []

  for (const field of fields) {
    if (!field.required)
      continue

    if (isEmptyValue(formPayload.value[field.key])) {
      errors[field.key] = [
        `${field.label} is required.`,
      ]
    }
  }

  formErrors.value = errors

  if (Object.keys(errors).length) {
    validationVersion.value++
    return false
  }

  return true
}

async function submitRecord(): Promise<EmployeesRow | null> {
  if (saving.value)
    return null

  if (!validateRequiredFields())
    return null

  saving.value = true
  formErrors.value = {}

  try {
    if (props.mode === "create") {
      return await request<EmployeesRow>(
        "/api/hr/employees/",
        {
          method: "POST",
          body: formPayload.value,
        },
      )
    }

    if (
      props.mode === "edit"
      && recordId.value
    ) {
      return await request<EmployeesRow>(
        `/api/hr/employees/${recordId.value}/`,
        {
          method: "PATCH",
          body: formPayload.value,
        },
      )
    }

    return null
  }
  catch (error: any) {
    formErrors.value = extractApiErrors(error)
    validationVersion.value++

    throw error
  }
  finally {
    saving.value = false
  }
}

async function saveWithAction(
  action: SaveAction,
) {
  try {
    const saved = await submitRecord()

    if (!saved?.id)
      return

    if (action === "new") {
      formPayload.value = {}
      formErrors.value = {}

      await router.push(
        "/hr/employees/create",
      )
      return
    }

    if (action === "close") {
      await router.push(
        "/hr/employees",
      )
      return
    }

    await router.push(
      `/hr/employees/${saved.id}/edit`,
    )
  }
  catch {
    // Field errors diteruskan ke tabs.
    // Toast global dapat ditambahkan di sini.
  }
}

async function handleSave() {
  await saveWithAction("stay")
}

async function handleSaveAndNew() {
  await saveWithAction("new")
}

async function handleSaveAndClose() {
  await saveWithAction("close")
}
</script>

<template>
  <template v-if="props.mode === 'list'">
    <EmployeesTable />
  </template>

  <template v-else>
    <div class="flex flex-col gap-6">
      <EmployeesHeader
        :mode="props.mode"
        :record="record"
        :record-id="recordId"
        :loading="pending"
        :saving="saving"
        @back="handleBack"
        @edit="handleEdit"
        @delete="handleDelete"
        @refresh="handleRefresh"
        @save="handleSave"
        @save-and-new="handleSaveAndNew"
        @save-and-close="handleSaveAndClose"
      />

      <EmployeesOverview
        v-if="props.mode !== 'create'"
        :mode="props.mode"
        :record="record"
        :record-id="recordId"
        :loading="pending"
        :items="overviewItems"
      />

      <EmployeesTabs
        :mode="props.mode"
        :record="record"
        :record-id="recordId"
        :tabs="tabs"
        :active-tab="activeTab"
        :loading="pending"
        :errors="formErrors"
        :validation-version="validationVersion"
        @update:active-tab="workspace.setActiveTab"
        @form-change="handleFormChange"
      />
    </div>
  </template>
</template>