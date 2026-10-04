import { ref } from "vue"
import { translate } from "../utils/i18n"
import { useNotify } from "@/composables/useNotify"
import { apiErrorMessage } from "../utils/errors"

type CrudActions = {
  remove: (id: number | string) => Promise<any>
}

type Options = {
  entity?: string
  getId?: (row: any) => number | string
  getLabel?: (row: any) => string
  notify?: {
    success: (message: string) => void
    error: (message: string) => void
  }
}

export function useCrudDelete<T = any>(
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
  const selected = ref<T | null>(null)
  const loading = ref(false)

  function ask(row: T) {
    selected.value = row
    open.value = true
  }

  async function confirm() {
    if (!selected.value) return

    loading.value = true

    const entity = options.entity ?? "Data"
    const id = options.getId?.(selected.value) ?? (selected.value as any).id
    const label =
      options.getLabel?.(selected.value) ??
      (selected.value as any).name ??
      (selected.value as any).username ??
      (selected.value as any).code ??
      entity

    try {
      await crud.remove(id)

      notify.success(translate("common.messages.deletedEntity", `${entity} "${label}" deleted`, { entity, label }))
      open.value = false
      selected.value = null
    } catch (e: any) {
      notify.error(apiErrorMessage(e, translate("common.errors.delete", "Failed to delete record.")))
    } finally {
      loading.value = false
    }
  }

  return {
    open,
    selected,
    loading,
    ask,
    confirm,
  }
}