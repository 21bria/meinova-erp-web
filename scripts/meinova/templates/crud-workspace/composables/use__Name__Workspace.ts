import {
  computed,
  ref,
  watch,
} from "vue"

import type {
  __Name__Row,
} from "../types"

export type __Name__WorkspaceMode =
  | "list"
  | "detail"
  | "create"
  | "edit"

export type __Name__WorkspaceTabType =
  | "form"
  | "resource"
  | "history"
  | "custom"

export interface __Name__WorkspaceTab {
  key: string
  label: string
  type?: __Name__WorkspaceTabType
  disabled?: boolean
  badge?: string | number

  requiresRecord?: boolean
  showOnCreate?: boolean

  endpoint?: string | null
  component?: string | null
  icon?: string | null
  order?: number
}

export interface Use__Name__WorkspaceOptions {
  mode?: __Name__WorkspaceMode
  defaultTab?: string
  tabs?: __Name__WorkspaceTab[]
}

export function use__Name__Workspace(
  options: Use__Name__WorkspaceOptions = {},
) {
  const mode = ref<__Name__WorkspaceMode>(
    options.mode ?? "list",
  )

  const selected = ref<__Name__Row | null>(null)

  const tabs = computed<__Name__WorkspaceTab[]>(() => {
    const source = Array.isArray(options.tabs)
      ? options.tabs
      : []

    return [...source]
      .filter((tab) => {
        if (!tab?.key)
          return false

        if (
          mode.value === "create"
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
      .map(tab => ({
        ...tab,
        disabled:
          tab.disabled === true
          || (
            tab.requiresRecord === true
            && mode.value === "create"
          ),
      }))
  })

  const firstAvailableTab = computed(() => {
    return tabs.value.find(
      tab => !tab.disabled,
    )?.key ?? ""
  })

  const activeTab = ref(
    options.defaultTab ?? "",
  )

  watch(
    tabs,
    (availableTabs) => {
      const currentTab = availableTabs.find(
        tab =>
          tab.key === activeTab.value
          && !tab.disabled,
      )

      if (currentTab)
        return

      activeTab.value =
        availableTabs.find(
          tab => !tab.disabled,
        )?.key ?? ""
    },
    {
      immediate: true,
    },
  )

  const isListMode = computed(
    () => mode.value === "list",
  )

  const isDetailMode = computed(
    () => mode.value === "detail",
  )

  const isCreateMode = computed(
    () => mode.value === "create",
  )

  const isEditMode = computed(
    () => mode.value === "edit",
  )

  const hasSelection = computed(
    () => selected.value !== null,
  )

  function setMode(
    value: __Name__WorkspaceMode,
  ) {
    mode.value = value
  }

  function setRecord(
    record: __Name__Row | null,
  ) {
    selected.value = record
  }

  function setActiveTab(
    key: string,
  ) {
    const tab = tabs.value.find(
      item =>
        item.key === key
        && !item.disabled,
    )

    if (!tab)
      return

    activeTab.value = tab.key
  }

  function reset() {
    selected.value = null
    mode.value = options.mode ?? "list"

    activeTab.value =
      options.defaultTab
      ?? firstAvailableTab.value
  }

  return {
    mode,
    selected,
    tabs,
    activeTab,

    isListMode,
    isDetailMode,
    isCreateMode,
    isEditMode,
    hasSelection,

    setMode,
    setRecord,
    setActiveTab,
    reset,
  }
}