import { ref } from "vue"
import { translate } from "../utils/i18n"
import { useNotify } from "@/composables/useNotify"
import { apiErrorMessage, normalizeApiErrors, wasReported } from "../utils/errors"

type CrudActions = {
  create: (payload: any) => Promise<any>
  update: (id: number | string, payload: any) => Promise<any>
  refresh?: () => Promise<any>
}

type Options = {
  getId?: (payload: any) => number | string | undefined
  getLabel?: (payload: any) => string
  entity?: string
  notify?: {
    success: (message: string) => void
    error: (message: string) => void
  }
}

export function useCrudDialog<T = any>(
  crud: CrudActions,
  options: Options = {},
) {

  /*
  | Notifikasi tidak lagi bergantung pada pemanggil.
  |
  | Dari 196 pemakaian composable CRUD di seluruh modul, hanya 4 yang
  | mengoper `notify` — tiga tabel Security yang ditambal tangan. Sisanya
  | memakai `options.notify?.error(...)`, dan optional-chaining
  | pada `undefined` **tidak melakukan apa-apa**: request ditolak 403, dialog
  | tetap terbuka, dan tidak ada satu kalimat pun yang muncul. Generator
  | tidak pernah menghasilkan `notify`, jadi ini tidak bisa diserahkan ke
  | sisi pemanggil — modul yang diregenerate akan diam lagi.
  */
  const notify = options.notify ?? useNotify()
  const open = ref(false)
  const mode = ref<"create" | "edit">("create")
  const selected = ref<T | null>(null)
  const loading = ref(false)
  const errors = ref<Record<string, any> | null>(null)

  function openCreate() {
    errors.value = null
    selected.value = null
    mode.value = "create"
    open.value = true
  }

  function openEdit(row: T) {
    errors.value = null
    selected.value = row
    mode.value = "edit"
    open.value = true
  }

  async function submit(payload: any) {
    loading.value = true
    errors.value = null

    const entity = options.entity ?? "Data"
    const label = options.getLabel?.(payload) ?? payload.name ?? payload.username ?? payload.code ?? entity

    try {
      if (mode.value === "create") {
        await crud.create(payload)
        notify.success(translate("common.messages.createdEntity", `${entity} "${label}" created`, { entity, label }))
      } else {
        const id = options.getId?.(payload) ?? payload.id

        if (!id) {
          throw new Error("Missing id for update")
        }

        await crud.update(id, payload)
        notify.success(translate("common.messages.updatedEntity", `${entity} "${label}" updated`, { entity, label }))
      }

      open.value = false
    } catch (e: any) {
      errors.value = normalizeApiErrors(e)

      // `normalizeApiErrors` sudah menampilkan error yang tidak menempel
      // ke kolom mana pun. Diperiksa lewat `wasReported`, bukan dengan
      // memanggil `reportApiError` di sini, supaya `options.notify`
      // buatan pemanggil tetap dipakai kalau ada — tiga tabel Security
      // mengopernya.
      if (!wasReported(e))
        notify.error(apiErrorMessage(e, translate("common.errors.save", "Failed to save record.")))
    } finally {
      loading.value = false
    }
  }

  return {
    open,
    mode,
    selected,
    loading,
    errors,

    openCreate,
    openEdit,
    submit,
  }
}