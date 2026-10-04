import { ref } from "vue"
import { translate } from "../utils/i18n"
import { useNotify } from "@/composables/useNotify"
import { apiErrorMessage } from "../utils/errors"

type CrudActions = {
  remove: (id: number | string) => Promise<any>
  refresh?: () => Promise<any>
}

type Options = {
  entity?: string
  notify?: {
    success: (message: string) => void
    error: (message: string) => void
    info: (message: string) => void
  }
}

export function useCrudBulkDelete(
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
  const ids = ref<string[]>([])
  const loading = ref(false)

  function ask(value: unknown) {
    const normalized = Array.isArray(value)
      ? value.map((id) => String(id).trim()).filter(Boolean)
      : []

    if (!normalized.length) {
      notify.info("No rows selected")
      return
    }

    ids.value = normalized
    open.value = true
  }

  async function confirm() {
    if (!ids.value.length) return

    loading.value = true

    const entity = options.entity ?? "item"

    try {
      await Promise.all(ids.value.map((id) => crud.remove(id)))

      notify.success(`${ids.value.length} ${entity}(s) deleted`)
      open.value = false
      ids.value = []
      await crud.refresh?.()
    } catch (e: any) {
      notify.error(apiErrorMessage(e, translate("common.errors.deleteSelected", "Failed to delete the selected records.")))
    } finally {
      loading.value = false
    }
  }

  return {
    open,
    ids,
    loading,
    ask,
    confirm,
  }
}