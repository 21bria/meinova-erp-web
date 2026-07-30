import type {
  CrudConfig,
  CrudUI,
} from "../../core/types/crud"

export type BuiltCrud = {
  id: string
  endpoint: string
  config: CrudConfig
  ui: CrudUI
  defaultQuery: Record<string, unknown>
}