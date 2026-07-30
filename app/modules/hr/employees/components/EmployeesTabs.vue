<script setup lang="ts">
import {
  computed,
  nextTick,
  ref,
  watch,
} from "vue"

import EmployeesForm from "./EmployeesForm.vue"

import {
  employeesForm,
} from "../form"

import type {
  EmployeesRow,
} from "../types"

import type {
  EmployeesWorkspaceMode,
  EmployeesWorkspaceTab,
} from "../composables/useEmployeesWorkspace"

const props = withDefaults(
  defineProps<{
    mode: EmployeesWorkspaceMode
    record?: EmployeesRow | null
    recordId?: string
    tabs?: EmployeesWorkspaceTab[]
    activeTab?: string
    loading?: boolean
    emptyText?: string
    errors?: Record<string, any> | null
    validationVersion?: number
  }>(),
  {
    record: null,
    recordId: undefined,
    tabs: () => [],
    activeTab: "",
    loading: false,
    emptyText: "No workspace tabs available.",
    errors: null,
    validationVersion: 0,
  },
)

const emit = defineEmits<{
  "update:activeTab": [key: string]
  "form-change": [payload: Record<string, unknown>]
}>()

const formModel = ref<Record<string, any>>({})

watch(
  () => props.record,
  (record) => {
    if (!record) {
      if (
        props.mode === "create"
        && Object.keys(formModel.value).length === 0
      ) {
        formModel.value = {}
      }

      return
    }

    formModel.value = {
      ...record,
    }
  },
  {
    immediate: true,
  },
)

const validTabs = computed<EmployeesWorkspaceTab[]>(() => {
  const source = Array.isArray(props.tabs)
    ? props.tabs
    : []

  return source
    .filter((tab) => {
      if (!tab?.key)
        return false

      if (
        props.mode === "create"
        && tab.showOnCreate === false
      ) {
        return false
      }

      return true
    })
    .sort(
      (a, b) =>
        Number(a.order ?? 9999)
        - Number(b.order ?? 9999),
    )
})

const enabledTabs = computed(() => {
  return validTabs.value.filter(
    tab => !tab.disabled,
  )
})

const resolvedActiveTab = computed(() => {
  const requestedTab = validTabs.value.find(
    tab =>
      tab.key === props.activeTab
      && !tab.disabled,
  )

  if (requestedTab)
    return requestedTab.key

  return enabledTabs.value[0]?.key ?? ""
})

watch(
  resolvedActiveTab,
  (key) => {
    if (
      key
      && key !== props.activeTab
    ) {
      emit("update:activeTab", key)
    }
  },
  {
    immediate: true,
  },
)

function handleTabChange(
  value: string | number,
) {
  const key = String(value)

  const tab = validTabs.value.find(
    item =>
      item.key === key
      && !item.disabled,
  )

  if (!tab)
    return

  emit("update:activeTab", tab.key)
}

function handleFormChange(
  payload: Record<string, any>,
) {
  formModel.value = {
    ...formModel.value,
    ...payload,
  }

  emit("form-change", {
    ...formModel.value,
  })
}

type EmployeesFormMode =
  | "create"
  | "edit"
  | "detail"

const formMode = computed<EmployeesFormMode>(() => {
  if (props.mode === "edit")
    return "edit"

  if (props.mode === "detail")
    return "detail"

  return "create"
})

const formFields = computed(() => {
  return Array.isArray(employeesForm)
    ? employeesForm
    : []
})

const fieldTabMap = computed<Record<string, string>>(() => {
  const result: Record<string, string> = {}

  for (const field of formFields.value) {
    result[field.key] =
      field.tab ?? "general"
  }

  return result
})

const tabErrorCounts = computed<Record<string, number>>(() => {
  const result: Record<string, number> = {}

  for (const key of Object.keys(props.errors ?? {})) {
    const tabKey =
      fieldTabMap.value[key]
      ?? "general"

    result[tabKey] =
      (result[tabKey] ?? 0) + 1
  }

  return result
})

function focusField(
  key: string,
) {
  const container = document.querySelector(
    `[data-field-key="${CSS.escape(key)}"]`,
  )

  if (!(container instanceof HTMLElement))
    return

  container.scrollIntoView({
    behavior: "smooth",
    block: "center",
  })

  const control = container.querySelector<HTMLElement>(
    [
      "input",
      "textarea",
      "button",
      "[role='combobox']",
      "[tabindex]:not([tabindex='-1'])",
    ].join(","),
  )

  control?.focus()
}

watch(
  () => props.validationVersion,
  async (version, previousVersion) => {
    if (
      version <= 0
      || version === previousVersion
    ) {
      return
    }

    const errorKeys = Object.keys(
      props.errors ?? {},
    )

    if (!errorKeys.length)
      return

    const firstErrorKey = errorKeys.find(
      key => Boolean(fieldTabMap.value[key]),
    )

    if (!firstErrorKey)
      return

    const targetTab =
      fieldTabMap.value[firstErrorKey]

    if (
      targetTab
      && targetTab !== props.activeTab
    ) {
      emit(
        "update:activeTab",
        targetTab,
      )
    }

    await nextTick()
    await nextTick()

    focusField(firstErrorKey)
  },
)
</script>

<template>
  <Card>
    <CardContent class="p-0">
      <div
        v-if="loading"
        class="space-y-4 p-6"
      >
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-48 w-full" />
      </div>

      <div
        v-if="!loading && validTabs.length === 0"
        class="flex min-h-48 items-center justify-center p-6"
      >
        <div class="text-center">
          <p class="text-sm text-muted-foreground">
            {{ emptyText }}
          </p>

          <p
            v-if="mode === 'create'"
            class="mt-1 text-xs text-muted-foreground"
          >
            Form tabs have not been generated yet.
          </p>
        </div>
      </div>

      <Tabs
        v-if="!loading && validTabs.length > 0"
        :model-value="resolvedActiveTab"
        class="w-full"
        @update:model-value="handleTabChange"
      >
        <div class="lg:grid lg:min-h-[640px] lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside class="border-b bg-muted/20 lg:border-b-0 lg:border-r">
            <div class="p-3 lg:sticky lg:top-0 lg:p-4">
              <TabsList
                class="
                  flex h-auto w-full items-center justify-start gap-1
                  overflow-x-auto bg-transparent p-0
                  lg:flex-col lg:items-stretch lg:overflow-visible
                "
              >
                <TabsTrigger
                  v-for="tab in validTabs"
                  :key="tab.key"
                  :value="tab.key"
                  :disabled="tab.disabled"
                  class="
                    h-auto shrink-0 justify-start rounded-md
                    px-3 py-2.5 text-left font-normal
                    data-[state=active]:bg-background
                    data-[state=active]:font-medium
                    data-[state=active]:shadow-sm
                    lg:w-full
                  "
                >
                  <span class="whitespace-nowrap">
                    {{ tab.label }}
                  </span>

                  <Badge
                    v-if="tabErrorCounts[tab.key]"
                    variant="destructive"
                    class="ml-2 shrink-0 px-1.5 py-0 text-xs"
                  >
                    {{ tabErrorCounts[tab.key] }}
                  </Badge>

                  <Badge
                    v-else-if="tab.badge !== undefined"
                    variant="secondary"
                    class="ml-2 shrink-0 px-1.5 py-0 text-xs"
                  >
                    {{ tab.badge }}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>
          </aside>

          <main class="min-w-0 p-4 sm:p-6">
            <TabsContent
              v-for="tab in validTabs"
              :key="tab.key"
              :value="tab.key"
              class="mt-0 focus-visible:outline-none"
            >
              <slot
                :name="tab.key"
                :tab="tab"
                :mode="mode"
                :record="record"
                :record-id="recordId"
              >

             <EmployeesForm
                v-if="
                  tab.type === 'form'
                  && mode !== 'list'
                "
                :mode="formMode"
                :tab-key="tab.key"
                :model-value="formModel"
                :loading="loading"
                :errors="errors"
                @update:model-value="handleFormChange"
              />
                <div
                  v-if="
                    tab.type !== 'form'
                    && tab.requiresRecord
                    && !recordId
                  "
                  class="flex min-h-48 items-center justify-center rounded-md border border-dashed"
                >
                  <div class="text-center">
                    <p class="text-sm font-medium">
                      Save the record first
                    </p>

                    <p class="mt-1 text-sm text-muted-foreground">
                      {{ tab.label }} will be available after this record is saved.
                    </p>
                  </div>
                </div>

                <div
                  v-if="
                    tab.type !== 'form'
                    && (
                      !tab.requiresRecord
                      || Boolean(recordId)
                    )
                  "
                  class="flex min-h-48 items-center justify-center rounded-md border border-dashed"
                >
                  <div class="text-center">
                    <p class="text-sm font-medium">
                      {{ tab.label }}
                    </p>

                    <p class="mt-1 text-sm text-muted-foreground">
                      This workspace section has not been connected yet.
                    </p>
                  </div>
                </div>
              </slot>
            </TabsContent>
          </main>
        </div>
      </Tabs>

    </CardContent>
  </Card>
</template>