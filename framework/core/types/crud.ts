export type CrudMode = "create" | "edit"

export type CrudConfig = {
  id?: string
  endpoint: string
  defaultQuery?: Record<string, unknown>
  name?: string
  ui?: Partial<CrudUI>
}

export type CrudUI = {
  create: boolean
  edit: boolean
  delete: boolean
  bulk_delete: boolean
  import: boolean
  export: boolean
}

export type ApiListMeta = {
  count: number
  total_pages: number
  page: number
  page_size: number
  next: string | null
  previous: string | null
}

export type ApiList<T> = {
  success: boolean
  message: string
  status_code: number
  data: T[]
  meta: ApiListMeta
}

export type CrudSort = {
  key: string | null
  dir: "asc" | "desc" | null
}

export type CrudNotify = {
  success: (message: string) => void
  error: (message: string) => void
  info?: (message: string) => void
}