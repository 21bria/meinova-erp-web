import {
  computed,
  onBeforeUnmount,
  ref,
  watch,
  type MaybeRefOrGetter,
} from "vue"

import {
  normalizeApiErrors,
} from "../utils/errors"

export type WorkspaceResourceId =
  | string
  | number

export interface WorkspaceResourceRow {
  id: WorkspaceResourceId
  [key: string]: any
}

export interface WorkspaceResourceResponse<T> {
  success?: boolean
  message?: string
  data?: T
  meta?: {
    count?: number
    page?: number
    page_size?: number
    total_pages?: number
  }
}

export interface UseWorkspaceResourceOptions<
  TRow extends WorkspaceResourceRow,
  TPayload extends Record<string, any>,
> {
  endpoint: MaybeRefOrGetter<string>

  parentKey?: string

  parentId?: MaybeRefOrGetter<
    WorkspaceResourceId | null | undefined
  >

  pageSize?: number

  ordering?: string

  immediate?: boolean

  transformPayload?: (
    payload: TPayload,
  ) => Record<string, any>

  transformRow?: (
    row: TRow,
  ) => TRow
}

function resolveValue<T>(
  value: MaybeRefOrGetter<T>,
): T {
  return toValue(value)
}

function normalizeEndpoint(
  endpoint: string,
) {
  return String(endpoint ?? "")
    .replace(/\/+$/, "")
}

function extractList<T>(
  response:
    | WorkspaceResourceResponse<T[]>
    | T[]
    | null
    | undefined,
): T[] {
  if (Array.isArray(response))
    return response

  if (Array.isArray(response?.data))
    return response.data

  return []
}

function extractRow<T>(
  response:
    | WorkspaceResourceResponse<T>
    | T
    | null
    | undefined,
): T | null {
  if (!response)
    return null

  if (
    typeof response === "object"
    && "data" in response
    && response.data
  ) {
    return response.data as T
  }

  return response as T
}

export function useWorkspaceResource<
  TRow extends WorkspaceResourceRow,
  TPayload extends Record<string, any> =
  Record<string, any>,
>(
  options: UseWorkspaceResourceOptions<
    TRow,
    TPayload
  >,
) {
  const {
    request,
  } = useApi()
  const rows = ref<TRow[]>([])
  const selected = ref<TRow | null>(null)

  const pending = ref(false)
  const saving = ref(false)
  const deleting = ref(false)

  const dialogOpen = ref(false)
  const deleteOpen = ref(false)

  const mode = ref<"create" | "edit">(
    "create",
  )

  const search = ref("")
  const page = ref(1)

  const ordering = ref(
    options.ordering ?? "",
  )

  let searchTimer:
    ReturnType<typeof setTimeout>
    | null = null

  const pageSize = ref(
    options.pageSize ?? 10,
  )
  const total = ref(0)

  const errors = ref<
    Record<string, any> | null
  >(null)

  const endpoint = computed(() =>
    normalizeEndpoint(
      resolveValue(options.endpoint),
    ),
  )

  const parentId = computed(() => {
    if (options.parentId === undefined)
      return null

    return resolveValue(
      options.parentId,
    )
  })

  const hasParent = computed(() => {
    if (!options.parentKey)
      return true

    return (
      parentId.value !== null
      && parentId.value !== undefined
      && parentId.value !== ""
    )
  })

  const canCreate = computed(
    () => hasParent.value,
  )

  function buildQuery() {
    const query: Record<string, any> = {
      page: page.value,
      page_size: pageSize.value,
    }

    if (search.value)
      query.search = search.value

    if (ordering.value)
      query.ordering = ordering.value

    if (
      options.parentKey
      && parentId.value != null
    ) {
      query[options.parentKey] =
        parentId.value
    }

    return query
  }

  function buildPayload(
    payload: TPayload,
  ) {
    const result: Record<string, any> = {
      ...payload,
    }

    if (
      options.parentKey
      && parentId.value != null
    ) {
      result[options.parentKey] =
        parentId.value
    }

    return options.transformPayload
      ? options.transformPayload(
        result as TPayload,
      )
      : result
  }

  async function fetchRows() {
    if (!endpoint.value)
      return

    if (!hasParent.value) {
      rows.value = []
      total.value = 0
      return
    }

    pending.value = true
    errors.value = null

    try {
      const response = await request<
        WorkspaceResourceResponse<TRow[]>
      >(
        `${endpoint.value}/`,
        {
          method: "GET",
          query: buildQuery(),
        },
      )

      const data = extractList(response)

      rows.value = options.transformRow
        ? data.map(options.transformRow)
        : data

      const responsePage =
        Number(response?.meta?.page)

      const responsePageSize =
        Number(response?.meta?.page_size)

      const responseCount =
        Number(response?.meta?.count)

      if (Number.isFinite(responsePage)) {
        page.value = responsePage
      }

      if (
        Number.isFinite(responsePageSize)
        && responsePageSize > 0
      ) {
        pageSize.value = responsePageSize
      }

      total.value =
        Number.isFinite(responseCount)
          ? responseCount
          : rows.value.length
    }
    catch (error) {
      errors.value =
        normalizeApiErrors(error)

      rows.value = []
      total.value = 0

      throw error
    }
    finally {
      pending.value = false
    }
  }

  function openCreate() {
    if (!canCreate.value)
      return

    mode.value = "create"
    selected.value = null
    errors.value = null
    dialogOpen.value = true
  }

  function openEdit(
    row: TRow,
  ) {
    mode.value = "edit"
    selected.value = row
    errors.value = null
    dialogOpen.value = true
  }

  function closeDialog() {
    dialogOpen.value = false
    selected.value = null
    errors.value = null
  }

  function containsFile(
    value: unknown,
  ): boolean {
    if (value instanceof File)
      return true

    if (Array.isArray(value)) {
      return value.some(
        item => item instanceof File,
      )
    }

    return false
  }

  function toRequestBody(
    payload: Record<string, any>,
  ): Record<string, any> | FormData {
    const hasFile = Object.values(
      payload,
    ).some(containsFile)

    if (!hasFile)
      return payload

    const formData = new FormData()

    for (
      const [key, value]
      of Object.entries(payload)
    ) {
      if (
        value === null
        || value === undefined
      ) {
        continue
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          formData.append(
            key,
            item instanceof File
              ? item
              : String(item),
          )
        }

        continue
      }

      if (value instanceof File) {
        formData.append(
          key,
          value,
        )

        continue
      }

      if (typeof value === "boolean") {
        formData.append(
          key,
          value ? "true" : "false",
        )

        continue
      }

      formData.append(
        key,
        String(value),
      )
    }

    return formData
  }

  /*
  | Menyimpan beberapa baris sekaligus — tabel inline — perlu menunda
  | penarikan ulangnya sampai baris terakhir selesai. Kalau setiap baris
  | menarik ulang sendiri, daftar sempat berisi sebagian baris baru
  | sementara sisanya masih berupa draft lokal, dan yang terlihat di
  | layar adalah barisnya berlipat.
  |
  | Bawaannya tetap menarik ulang, supaya dialog per baris yang sudah
  | ada tidak berubah perilaku.
  */
  interface WriteOptions {
    refresh?: boolean
  }

  async function create(
    payload: TPayload,
    options: WriteOptions = {},
  ) {
    saving.value = true
    errors.value = null

    try {
      const requestPayload =
          buildPayload(payload)

        const response = await request<
          WorkspaceResourceResponse<TRow>
        >(
          `${endpoint.value}/`,
          {
            method: "POST",
            body: toRequestBody(
              requestPayload,
            ),
          },
        )

      const row = extractRow(response)

      if (options.refresh !== false)
        await fetchRows()

      closeDialog()

      return row
    }
    catch (error) {
      errors.value =
        normalizeApiErrors(error)

      throw error
    }
    finally {
      saving.value = false
    }
  }

  async function update(
    id: WorkspaceResourceId,
    payload: TPayload,
    options: WriteOptions = {},
  ) {
    saving.value = true
    errors.value = null

    try {
      const requestPayload =
        buildPayload(payload)
      const response = await request<
        WorkspaceResourceResponse<TRow>
        >(
        `${endpoint.value}/${id}/`,
        {
          method: "PATCH",
          body: toRequestBody(
            requestPayload,
          ),
        },
      )
      
      const row = extractRow(response)

      if (options.refresh !== false)
        await fetchRows()

      closeDialog()

      return row
    }
    catch (error) {
      errors.value =
        normalizeApiErrors(error)

      throw error
    }
    finally {
      saving.value = false
    }
  }

  async function submit(
    payload: TPayload,
  ) {
    if (
      mode.value === "edit"
      && selected.value?.id != null
    ) {
      return update(
        selected.value.id,
        payload,
      )
    }

    return create(payload)
  }

  function askDelete(
    row: TRow,
  ) {
    selected.value = row
    deleteOpen.value = true
  }

  function cancelDelete() {
    deleteOpen.value = false
    selected.value = null
  }

  async function confirmDelete() {
    if (selected.value?.id == null)
      return

    deleting.value = true

    try {
      await request(
        `${endpoint.value}/${selected.value.id}/`,
        {
          method: "DELETE",
        },
      )
      deleteOpen.value = false
      selected.value = null

      await fetchRows()
    }
    finally {
      deleting.value = false
    }
  }

  function onSearch(
    value: string,
  ) {
    search.value = value
    page.value = 1

    if (searchTimer)
      clearTimeout(searchTimer)

    searchTimer = setTimeout(
      () => {
        searchTimer = null
        fetchRows()
      },
      400,
    )
  }

  function onChangePage(
    value: number,
  ) {
    page.value = value
    fetchRows()
  }

  function onChangePageSize(
    value: number,
  ) {
    pageSize.value = value
    page.value = 1
    fetchRows()
  }

  function onChangeSorting(
    value: {
      key: string | null
      dir: "asc" | "desc" | null
    },
  ) {
    if (!value.key || !value.dir) {
      ordering.value = ""
    }
    else {
      ordering.value =
        value.dir === "desc"
          ? `-${value.key}`
          : value.key
    }

    page.value = 1
    fetchRows()
  }

  watch(
    parentId,
    () => {
      page.value = 1
      fetchRows()
    },
  )

  if (options.immediate !== false) {
    fetchRows()
  }

  /*
  |--------------------------------------------------------------------------
  | Cleanup
  |--------------------------------------------------------------------------
  */

  onBeforeUnmount(() => {
    if (searchTimer)
      clearTimeout(searchTimer)
  })

  return {
    rows,
    selected,

    pending,
    saving,
    deleting,

    dialogOpen,
    deleteOpen,
    mode,

    search,
    page,
    pageSize,
    total,
    ordering,

    errors,

    endpoint,
    parentId,
    hasParent,
    canCreate,

    fetchRows,
    refresh: fetchRows,

    openCreate,
    openEdit,
    closeDialog,

    create,
    update,
    submit,

    askDelete,
    cancelDelete,
    confirmDelete,

    onSearch,
    onChangePage,
    onChangePageSize,
    onChangeSorting,
  }
}