import {
  computed,
  ref,
  watch,
} from "vue"

import type {
  EmployeesRow,
} from "../types"

export type EmployeesWorkspaceMode =
  | "list"
  | "detail"
  | "create"
  | "edit"

export type EmployeesWorkspaceTabType =
  | "form"
  | "resource"
  | "history"
  | "custom"

export interface EmployeesWorkspaceTab {
  key: string
  label: string
  type?: EmployeesWorkspaceTabType
  disabled?: boolean
  badge?: string | number

  requiresRecord?: boolean
  showOnCreate?: boolean

  endpoint?: string | null
  component?: string | null
  icon?: string | null
  order?: number
}

export interface UseEmployeesWorkspaceOptions {
  mode?: EmployeesWorkspaceMode
  defaultTab?: string
  tabs?: EmployeesWorkspaceTab[]
}

export function useEmployeesWorkspace(
  options: UseEmployeesWorkspaceOptions = {},
) {
  const mode = ref<EmployeesWorkspaceMode>(
    options.mode ?? "list",
  )

  const selected = ref<EmployeesRow | null>(null)

  const tabs = computed<EmployeesWorkspaceTab[]>(() => {
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
    value: EmployeesWorkspaceMode,
  ) {
    mode.value = value
  }

  function setRecord(
    record: EmployeesRow | null,
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