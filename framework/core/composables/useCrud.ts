import { computed, ref, watchEffect } from "vue"
import { useDebounceFn } from "@vueuse/core"
import { useAsyncData } from "#app"

import { useApi } from "@/composables/useApi"
import { useNotify } from "@/composables/useNotify"

import type {
  ApiList,
  CrudConfig,
  CrudUI,
} from "../types/crud"

export function useCrud<T extends { id?: number; name?: string; code?: string }>(
  config: CrudConfig,
) {
  const { request } = useApi()
  const notify = useNotify()

  const ui = computed<CrudUI>(() => ({
    create: config.ui?.create ?? true,
    edit: config.ui?.edit ?? true,
    delete: config.ui?.delete ?? true,
    bulk_delete: config.ui?.bulk_delete ?? false,
    import: config.ui?.import ?? false,
    export: config.ui?.export ?? false,
  }))

  const rows = ref<T[]>([])
  const total = ref(0)
  const totalPages = ref(1)

  const page = ref(1)
  const pageSize = ref(10)
  const search = ref("")
  const ordering = ref<string | null>(null)

  const serverFilters = ref<Record<string, any>>({
    ...(config.defaultQuery ?? {}),
  })

  const query = computed(() => ({
    page: page.value,
    page_size: pageSize.value,
    search: search.value || "",
    ordering: ordering.value || undefined,
    ...serverFilters.value,
  }))

  const { data, pending, error, refresh } = useAsyncData<ApiList<T>>(
    () => `${config.name ?? config.endpoint}:${JSON.stringify(query.value)}`,
    () =>
      request(config.endpoint, {
        method: "GET",
        query: query.value,
      }),
    {
      server: false,
    },
  )

  watchEffect(() => {
    const meta = data.value?.meta

    rows.value = data.value?.data ?? []

    total.value = meta?.count ?? 0

    totalPages.value =
      meta?.total_pages
      ?? Math.max(
        1,
        Math.ceil((meta?.count ?? 0) / pageSize.value),
      )
  })

  const debouncedSearch = useDebounceFn(() => {
    page.value = 1
    refresh()
  }, 350)

  function onApply({
    search: nextSearch,
    filters,
  }: {
    search?: string
    filters?: Record<string, any>
  }) {
    search.value = nextSearch ?? ""
    serverFilters.value = { ...(filters ?? {}) }
    page.value = 1

    refresh()
  }

  function onReset() {
    search.value = ""
    serverFilters.value = {
      ...(config.defaultQuery ?? {}),
    }
    page.value = 1

    refresh()
  }

  function onSort({
    key,
    dir,
  }: {
    key: string | null
    dir: "asc" | "desc" | null
  }) {
    ordering.value =
      !key || !dir
        ? null
        : `${dir === "desc" ? "-" : ""}${key}`

    page.value = 1
    refresh()
  }

  function onSearch(value: string) {
    search.value = value
    debouncedSearch()
  }

  function onChangePage(value: number) {
    page.value = value
    refresh()
  }

  function onChangePageSize(value: number) {
    pageSize.value = value
    page.value = 1
    refresh()
  }

  async function create(payload: any) {
    await request(config.endpoint, {
      method: "POST",
      body: payload,
    })

    await refresh()
  }

  async function update(
    id: number | string,
    payload: any,
  ) {
    await request(`${config.endpoint}${id}/`, {
      method: "PATCH",
      body: payload,
    })

    await refresh()
  }

  async function remove(id: number | string) {
    await request(`${config.endpoint}${id}/`, {
      method: "DELETE",
    })

    await refresh()
  }

  watchEffect(() => {
    if (error.value) {
      notify.error(
        (error.value as any)?.message
        || "Failed to load data",
      )
    }
  })

  return {
    ui,

    rows,
    total,
    totalPages,
    page,
    pageSize,
    search,
    ordering,
    serverFilters,
    pending,
    error,
    refresh,

    onSearch,
    onApply,
    onReset,
    onSort,
    onChangePage,
    onChangePageSize,

    create,
    update,
    remove,
  }
}