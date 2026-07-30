<script setup lang="ts">
import __Name__Header from "./components/__Name__Header.vue"
import __Name__Overview from "./components/__Name__Overview.vue"
import __Name__Table from "./components/__Name__Table.vue"
import __Name__Tabs from "./components/__Name__Tabs.vue"
import {__Camel__Form,} from "./form"

import {
  use__Name__Detail,
} from "./composables/use__Name__Detail"

import {
  use__Name__Workspace,
} from "./composables/use__Name__Workspace"

import type {
  __Name__Row,
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

const workspaceTabs = __WORKSPACE_TABS__
const overviewItems: any[] =__OVERVIEW_ITEMS__


const workspace = use__Name__Workspace({
  mode: props.mode,
  defaultTab: __WORKSPACE_DEFAULT_TAB__,
  tabs: workspaceTabs,
})

const detail = use__Name__Detail()

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
  router.push("/__modulePath__")
}

function handleEdit(
  currentRecord: __Name__Row,
) {
  if (currentRecord.id == null)
    return

  router.push(
    `/__modulePath__/${currentRecord.id}/edit`,
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
  currentRecord: __Name__Row,
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

  const fields = Array.isArray(__Camel__Form)
    ? __Camel__Form
    : __Camel__Form.fields ?? []

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

async function submitRecord(): Promise<__Name__Row | null> {
  if (saving.value)
    return null

  if (!validateRequiredFields())
    return null

  saving.value = true
  formErrors.value = {}

  try {
    if (props.mode === "create") {
      return await request<__Name__Row>(
        "__ENDPOINT__",
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
      return await request<__Name__Row>(
        `__ENDPOINT__${recordId.value}/`,
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
        "/__modulePath__/create",
      )

      return
    }

    if (action === "close") {
      await router.push(
        "/__modulePath__",
      )

      return
    }

    await router.push(
      `/__modulePath__/${saved.id}/edit`,
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
    <__Name__Table />
  </template>

  <template v-else>
    <div class="flex flex-col gap-6">
      <__Name__Header
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

      <__Name__Overview
        v-if="props.mode !== 'create'"
        :mode="props.mode"
        :record="record"
        :record-id="recordId"
        :loading="pending"
        :items="overviewItems"
      />

      <__Name__Tabs
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