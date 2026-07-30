import type {
  CrudFilter,
  FilterOption,
  FilterPlacement,
} from "./types"

type FilterExtra = {
  placeholder?: string
  placement?: FilterPlacement
  props?: Record<string, any>
  visible?: boolean
  width?: string
}

export const filter = {
  text(key: string, label?: string, extra: FilterExtra = {}): CrudFilter {
    return { key, type: "text", label, ...extra }
  },

  select(
    key: string,
    label: string,
    options: FilterOption[],
    extra: FilterExtra = {},
  ): CrudFilter {
    return { key, type: "select", label, options, ...extra }
  },

  lookup(
    key: string,
    label: string,
    endpoint: string,
    extra: FilterExtra = {},
  ): CrudFilter {
    return { key, type: "lookup", label, endpoint, ...extra }
  },

  multiLookup(
    key: string,
    label: string,
    endpoint: string,
    extra: FilterExtra = {},
  ): CrudFilter {
    return { key, type: "multiLookup", label, endpoint, multiple: true, ...extra }
  },

  date(key: string, label: string, extra: FilterExtra = {}): CrudFilter {
    return { key, type: "date", label, ...extra }
  },

  dateRange(key: string, label = "Period", extra: FilterExtra = {}): CrudFilter {
    return { key, type: "dateRange", label, ...extra }
  },

  boolean(key: string, label: string, extra: FilterExtra = {}): CrudFilter {
    return { key, type: "boolean", label, ...extra }
  },

  custom(key: string, component: any, extra: FilterExtra = {}): CrudFilter {
    return { key, type: "custom", component, ...extra }
  },
}