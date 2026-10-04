<script setup lang="ts">
import {
  computed,
  nextTick,
  ref,
  watch,
} from "vue"

import type {
  CandidatesRow,
} from "../types"

import type {
  CandidatesWorkspaceMode,
  CandidatesWorkspaceTab,
} from "../composables/useCandidatesWorkspace"

const props = withDefaults(
  defineProps<{
    mode: CandidatesWorkspaceMode
    record?: CandidatesRow | null
    recordId?: string | number
    tabs?: CandidatesWorkspaceTab[]
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
}>()

/*
|--------------------------------------------------------------------------
| Record state
|--------------------------------------------------------------------------
*/

const hasRecord = computed(() => {
  return (
    props.recordId !== undefined
    && props.recordId !== null
    && props.recordId !== ""
  )
})

/*
|--------------------------------------------------------------------------
| Workspace tabs
|--------------------------------------------------------------------------
*/

function isVisible(
  tab: CandidatesWorkspaceTab,
) {
  if (!tab?.key)
    return false

  if (
    props.mode === "create"
    && tab.showOnCreate === false
  ) {
    return false
  }

  if (
    Array.isArray(tab.modes)
    && tab.modes.length > 0
    && !tab.modes.includes(props.mode)
  ) {
    return false
  }

  return true
}

function isDisabled(
  tab: CandidatesWorkspaceTab,
) {
  if (tab.disabled)
    return true

  if (
    tab.requiresRecord
    && !hasRecord.value
  ) {
    return true
  }

  return false
}

const validTabs = computed<CandidatesWorkspaceTab[]>(() => {
  const source = Array.isArray(props.tabs)
    ? props.tabs
    : []

  return source
    .filter(isVisible)
    .sort(
      (left, right) =>
        Number(left.order ?? 9999)
        - Number(right.order ?? 9999),
    )
})

const enabledTabs = computed(() => {
  return validTabs.value.filter(
    tab => !isDisabled(tab),
  )
})

const resolvedActiveTab = computed(() => {
  const requested = validTabs.value.find(
    tab =>
      tab.key === props.activeTab
      && !isDisabled(tab),
  )

  if (requested)
    return requested.key

  return enabledTabs.value[0]?.key ?? ""
})

/*
| Tab yang sudah pernah dibuka tidak dilepas lagi dari DOM — hanya
| disembunyikan lewat CSS.
|
| Bawaan TabsContent melepas isi tab yang tidak aktif, dan itu membuang
| state lokal komponennya. Yang paling terasa di tabel inline: baris
| yang baru diketik tapi belum ditekan "Save Rows" lenyap begitu
| penggunanya menengok tab sebelah untuk memeriksa tanggal — persis
| hal yang membuatnya pindah tab.
|
| Dijaga hanya untuk tab yang PERNAH dibuka, bukan semuanya sekaligus:
| tiap tab resource menembak satu request daftar saat dipasang, dan
| memasang semuanya di awal berarti membayar request untuk tab yang
| mungkin tidak pernah dilihat.
*/
const keptTabs = ref<Set<string>>(new Set())

watch(
  resolvedActiveTab,
  (key) => {
    if (!key)
      return

    if (!keptTabs.value.has(key)) {
      keptTabs.value = new Set(
        keptTabs.value,
      ).add(key)
    }

    if (key !== props.activeTab)
      emit("update:activeTab", key)
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
      && !isDisabled(item),
  )

  if (!tab)
    return

  emit("update:activeTab", tab.key)
}

/*
|--------------------------------------------------------------------------
| Validation errors
|--------------------------------------------------------------------------
*/

const fieldTabMap = computed<Record<string, string>>(() => {
  const result: Record<string, string> = {}

  for (const tab of validTabs.value) {
    if (!Array.isArray(tab.fields))
      continue

    for (const field of tab.fields) {
      if (!field)
        continue

      result[String(field)] = tab.key
    }
  }

  return result
})

const tabErrorCounts = computed<Record<string, number>>(() => {
  const result: Record<string, number> = {}

  for (const fieldKey of Object.keys(props.errors ?? {})) {
    const tabKey = fieldTabMap.value[fieldKey]

    if (!tabKey)
      continue

    result[tabKey] =
      (result[tabKey] ?? 0) + 1
  }

  return result
})

function focusField(
  fieldKey: string,
) {
  if (!import.meta.client)
    return

  const escapedKey =
    typeof CSS !== "undefined"
    && typeof CSS.escape === "function"
      ? CSS.escape(fieldKey)
      : fieldKey

  const container = document.querySelector(
    `[data-field-key="${escapedKey}"]`,
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
      "select",
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

    if (errorKeys.length === 0)
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
      <!-- Loading -->
      <div
        v-if="loading"
        class="space-y-4 p-6"
      >
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-48 w-full" />
      </div>

      <!-- Empty workspace -->
      <div
        v-else-if="validTabs.length === 0"
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
            Workspace tabs have not been configured yet.
          </p>
        </div>
      </div>

      <!-- Workspace -->
      <Tabs
        v-else
        :model-value="resolvedActiveTab"
        class="w-full"
        @update:model-value="handleTabChange"
      >
        <div
          class="
            lg:grid
            lg:min-h-[640px]
            lg:grid-cols-[240px_minmax(0,1fr)]
          "
        >
          <!-- Sidebar -->
          <aside
            class="
              border-b bg-muted/20
              lg:border-b-0 lg:border-r
            "
          >
            <div class="p-3 lg:sticky lg:top-0 lg:p-4">
              <TabsList
                class="
                  flex h-auto w-full items-center
                  justify-start gap-1 overflow-x-auto
                  bg-transparent p-0
                  lg:flex-col lg:items-stretch
                  lg:overflow-visible
                "
              >
                <TabsTrigger
                  v-for="tab in validTabs"
                  :key="tab.key"
                  :value="tab.key"
                  :disabled="isDisabled(tab)"
                  class="
                    h-auto shrink-0 justify-start
                    rounded-md px-3 py-2.5
                    text-left font-normal
                    data-[state=active]:bg-background
                    data-[state=active]:font-medium
                    data-[state=active]:shadow-sm
                    lg:w-full
                  "
                >
                  <span
                    class="
                      flex min-w-0 flex-1
                      items-center gap-2
                    "
                  >
                    <span class="truncate">
                      {{ tab.label }}
                    </span>
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

          <!-- Content -->
          <main class="min-w-0 p-4 sm:p-6">
            <TabsContent
              v-for="tab in validTabs"
              :key="tab.key"
              :value="tab.key"
              :force-mount="
                keptTabs.has(tab.key)
                  || undefined
              "
              class="
                mt-0 focus-visible:outline-none
                data-[state=inactive]:hidden
              "
            >
              <!-- Record-required state -->
              <div
                v-if="
                  tab.requiresRecord
                  && !hasRecord
                "
                class="
                  flex min-h-48 items-center
                  justify-center rounded-md
                  border border-dashed
                "
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

              <!-- Tab content -->
              <slot
                v-else
                :name="tab.key"
                :tab="tab"
                :mode="mode"
                :record="record"
                :record-id="recordId"
                :readonly="Boolean(tab.readonly)"
              >
                <div
                  class="
                    flex min-h-48 items-center
                    justify-center rounded-md
                    border border-dashed
                  "
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