export type FilterPlacement =
  | "quick"
  | "advanced"

export type FilterType =
  | "text"
  | "select"
  | "lookup"
  | "date"
  | "dateRange"
  | "number"
  | "numberRange"
  | "switch"
  | "boolean"
  | "custom"

export interface FilterOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

export interface CrudFilter {
  key: string
  type: FilterType

  label?: string
  placeholder?: string

  endpoint?: string
  multiple?: boolean
  options?: FilterOption[]

  component?: any
  props?: Record<string, any>

  defaultValue?: any
  visible?: boolean
  width?: string

  placement?: FilterPlacement

  // Cascading lookup
  dependsOn?: string | string[]

  lookupParams?: Record<
    string,
    string | number | boolean | null
  >
}

export interface CrudFilters {
  search?: {
    enabled?: boolean
    placeholder?: string
  }

  advanced?: boolean

  items: CrudFilter[]
}