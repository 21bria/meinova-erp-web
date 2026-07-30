import { ref } from "vue"
import { normalizeApiErrors } from "../utils/errors"

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
        options.notify?.success(`${entity} "${label}" created`)
      } else {
        const id = options.getId?.(payload) ?? payload.id

        if (!id) {
          throw new Error("Missing id for update")
        }

        await crud.update(id, payload)
        options.notify?.success(`${entity} "${label}" updated`)
      }

      open.value = false
    // } catch (e: any) {
    //   errors.value = e?.data ?? { detail: e?.message || "Failed to save" }
    //   options.notify?.error(errors.value?.detail || "Failed to save")
    } catch (e: any) {
      errors.value = normalizeApiErrors(e)
      const message =
        e?.data?.message
        ?? e?.data?.detail
        ?? e?.response?._data?.message
        ?? e?.response?._data?.detail
        ?? e?.response?.data?.message
        ?? e?.response?.data?.detail
        ?? e?.message
        ?? "Failed to save"
      options.notify?.error(message)
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