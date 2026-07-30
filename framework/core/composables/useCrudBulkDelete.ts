import { ref } from "vue"

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
  const open = ref(false)
  const ids = ref<string[]>([])
  const loading = ref(false)

  function ask(value: unknown) {
    const normalized = Array.isArray(value)
      ? value.map((id) => String(id).trim()).filter(Boolean)
      : []

    if (!normalized.length) {
      options.notify?.info("No rows selected")
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

      options.notify?.success(`${ids.value.length} ${entity}(s) deleted`)
      open.value = false
      ids.value = []
      await crud.refresh?.()
    } catch (e: any) {
      options.notify?.error(e?.data?.detail || e?.message || "Failed to bulk delete")
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