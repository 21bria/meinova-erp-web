import { ref } from "vue"

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

      options.notify?.success(`${entity} "${label}" deleted`)
      open.value = false
      selected.value = null
    } catch (e: any) {
      options.notify?.error(e?.data?.detail || e?.message || "Failed to delete")
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