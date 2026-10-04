import {
  computed,
  ref,
  watch,
} from "vue"

import type {
  __Name__Row,
} from "../types"

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export type __Name__WorkspaceMode =
  | "list"
  | "detail"
  | "create"
  | "edit"

export type __Name__WorkspaceTabType =
  | "overview"
  | "form"
  | "resource"
  | "history"
  | "custom"

/*
 * Isi `fields` sebuah tab punya **dua bentuk**, dan tipenya harus
 * memuat keduanya.
 *
 * Tab `form` menyebut nama kolomnya saja — definisi lengkapnya ada di
 * `form.ts`. Tab `resource` membawa **salinan config field-nya sendiri**
 * (lihat catatan `_grid()` di schema Travel Request): grid inline
 * memilih kolom dari flag `table`, jadi dua tabel yang membaca endpoint
 * sama tidak boleh berbagi objek yang sama.
 *
 * Selama tipenya cuma `string[]`, setiap module yang punya tab resource
 * membawa selusin error TypeScript yang tidak menandakan apa pun —
 * enam module workspace, 187 error, semuanya bunyinya sama.
 */
export type __Name__WorkspaceTabField = string | Record<string, any>

export interface __Name__WorkspaceTab {
  key: string
  label: string

  /*
   * Kunci terjemahan untuk `label`. Opsional dan berdampingan dengan
   * `label`, yang tetap teks Inggris dan dipakai sebagai fallback.
   * Diresolusi saat render oleh komponen Workspace — lihat
   * `localizeTab` di sana.
   */
  labelKey?: string

  type?: __Name__WorkspaceTabType

  fields?: __Name__WorkspaceTabField[] | null
  modes?: __Name__WorkspaceMode[] | null

  disabled?: boolean
  readonly?: boolean

  badge?: string | number

  requiresRecord?: boolean
  showOnCreate?: boolean

  // Baris disunting langsung di tabel, bukan lewat dialog per baris.
  inline?: boolean

  // false = baris dibuat di tab lain, tombol tambah disembunyikan.
  canCreate?: boolean

  // Syarat kunci per record induk (`{field, op, value}`), mis. tabel
  // anak dokumen yang sudah diajukan. Benar = tab dibaca saja: tanpa
  // tambah, sunting, atau hapus. Pagar tampilan — service tetap
  // menolaknya.
  readonlyWhen?: Record<string, any> | null

  // false = baris tersimpan tidak bisa dihapus dari tab ini (draft tetap
  // bisa dibuang).
  canDelete?: boolean

  // Teks bantu tab + kunci terjemahannya (`<ns>.tabHints.<key>`).
  description?: string
  descriptionKey?: string

  endpoint?: string | null
  module?: string | null
  foreignKey?: string | null
  component?: string | null
  icon?: string | null

  order?: number
}

export interface Use__Name__WorkspaceOptions {
  mode?: __Name__WorkspaceMode
  defaultTab?: string
  tabs?: __Name__WorkspaceTab[]
}

/*
|--------------------------------------------------------------------------
| Composable
|--------------------------------------------------------------------------
*/

export function use__Name__Workspace(
  options: Use__Name__WorkspaceOptions = {},
) {
  const initialMode =
    options.mode ?? "list"

  const initialDefaultTab =
    options.defaultTab ?? ""

  const mode = ref<__Name__WorkspaceMode>(
    initialMode,
  )

  const selected = ref<__Name__Row | null>(
    null,
  )

  const activeTab = ref<string>(
    initialDefaultTab,
  )

  /*
  |--------------------------------------------------------------------------
  | Record state
  |--------------------------------------------------------------------------
  */

  const recordId = computed(() => {
    return selected.value?.id ?? null
  })

  /*
   * `!= null` menutup `null` **dan** `undefined` sekaligus. Versi
   * sebelumnya juga membandingkan dengan string kosong, padahal
   * `recordId` diturunkan dari `selected.value?.id` yang tidak pernah
   * berupa string — jadi cabang itu tidak pernah bisa benar, dan
   * TypeScript melaporkannya di setiap module workspace.
   */
  const hasRecord = computed(() => {
    return recordId.value != null
  })

  const hasSelection = computed(() => {
    return selected.value !== null
  })

  /*
  |--------------------------------------------------------------------------
  | Workspace tabs
  |--------------------------------------------------------------------------
  */

  function isVisible(
    tab: __Name__WorkspaceTab,
  ) {
    if (!tab?.key)
      return false

    if (
      mode.value === "create"
      && tab.showOnCreate === false
    ) {
      return false
    }

    if (
      Array.isArray(tab.modes)
      && tab.modes.length > 0
      && !tab.modes.includes(mode.value)
    ) {
      return false
    }

    return true
  }

  function isDisabled(
    tab: __Name__WorkspaceTab,
  ) {
    if (tab.disabled === true)
      return true

    if (
      tab.requiresRecord === true
      && !hasRecord.value
    ) {
      return true
    }

    return false
  }

  const tabs = computed<__Name__WorkspaceTab[]>(() => {
    const source = Array.isArray(options.tabs)
      ? options.tabs
      : []

    return source
      .filter(isVisible)
      .sort(
        (left, right) =>
          Number(left.order ?? 9999)
          - Number(right.order ?? 9999),
      )
      .map(tab => ({
        ...tab,
        disabled: isDisabled(tab),
      }))
  })

  const enabledTabs = computed(() => {
    return tabs.value.filter(
      tab => !tab.disabled,
    )
  })

  const firstAvailableTab = computed(() => {
    return enabledTabs.value[0]?.key ?? ""
  })

  /*
  |--------------------------------------------------------------------------
  | Active tab
  |--------------------------------------------------------------------------
  */

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

      const configuredDefault =
        availableTabs.find(
          tab =>
            tab.key === initialDefaultTab
            && !tab.disabled,
        )

      activeTab.value =
        configuredDefault?.key
        ?? availableTabs.find(
          tab => !tab.disabled,
        )?.key
        ?? ""
    },
    {
      immediate: true,
    },
  )

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

  /*
  |--------------------------------------------------------------------------
  | Mode state
  |--------------------------------------------------------------------------
  */

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

  function setMode(
    value: __Name__WorkspaceMode,
  ) {
    mode.value = value
  }

  /*
  |--------------------------------------------------------------------------
  | Record actions
  |--------------------------------------------------------------------------
  */

  function setRecord(
    record: __Name__Row | null,
  ) {
    selected.value = record
  }

  function clearRecord() {
    selected.value = null
  }

  /*
  |--------------------------------------------------------------------------
  | Reset
  |--------------------------------------------------------------------------
  */

  function reset() {
    selected.value = null
    mode.value = initialMode
    activeTab.value = initialDefaultTab
  }

  return {
    /*
     * State
     */
    mode,
    selected,
    recordId,
    hasRecord,
    hasSelection,

    tabs,
    enabledTabs,
    activeTab,
    firstAvailableTab,

    /*
     * Mode helpers
     */
    isListMode,
    isDetailMode,
    isCreateMode,
    isEditMode,

    /*
     * Actions
     */
    setMode,
    setRecord,
    clearRecord,
    setActiveTab,
    reset,
  }
}