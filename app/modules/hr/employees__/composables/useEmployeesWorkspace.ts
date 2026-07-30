import {
  computed,
  ref,
} from "vue"

import type {
  EmployeesRow,
} from "../types"

export type EmployeesWorkspaceMode =
  | "list"
  | "detail"
  | "create"
  | "edit"

export interface EmployeesWorkspaceTab {
  key: string
  label: string
  disabled?: boolean
  badge?: string | number
}

export interface UseEmployeesWorkspaceOptions {
  defaultMode?: EmployeesWorkspaceMode
  defaultTab?: string
  tabs?: EmployeesWorkspaceTab[]
}

const defaultTabs: EmployeesWorkspaceTab[] = [
  {
    key: "overview",
    label: "Overview",
  },
  {
    key: "details",
    label: "Details",
  },
  {
    key: "activity",
    label: "Activity",
  },
]

export function useEmployeesWorkspace(
  options: UseEmployeesWorkspaceOptions = {},
) {
  const mode = ref<EmployeesWorkspaceMode>(
    options.defaultMode ?? "list",
  )

  const activeTab = ref(
    options.defaultTab ?? "overview",
  )

  const selected = ref<EmployeesRow | null>(null)

  const tabs = computed(
    () => options.tabs ?? defaultTabs,
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

  function showList() {
    mode.value = "list"
  }

  function showDetail(
    record?: EmployeesRow,
  ) {
    if (record)
      selected.value = record

    mode.value = "detail"
  }

  function showCreate() {
    selected.value = null
    mode.value = "create"
  }

  function showEdit(
    record?: EmployeesRow,
  ) {
    if (record)
      selected.value = record

    if (!selected.value)
      return

    mode.value = "edit"
  }

  function select(
    record: EmployeesRow,
  ) {
    selected.value = record
    mode.value = "detail"
  }

  function clearSelection() {
    selected.value = null
    activeTab.value =
      options.defaultTab ?? "overview"

    mode.value = "list"
  }

  function setActiveTab(
    key: string,
  ) {
    const tabExists = tabs.value.some(
      tab =>
        tab.key === key
        && !tab.disabled,
    )

    if (!tabExists)
      return

    activeTab.value = key
  }

  return {
    mode,
    activeTab,
    selected,
    tabs,

    isListMode,
    isDetailMode,
    isCreateMode,
    isEditMode,
    hasSelection,

    showList,
    showDetail,
    showCreate,
    showEdit,
    select,
    clearSelection,
    setActiveTab,
  }
}