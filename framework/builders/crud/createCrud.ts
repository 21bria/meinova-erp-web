import type {
  CrudConfig,
  CrudUI,
} from "../../core/types/crud"

import type { BuiltCrud } from "./types"

const DEFAULT_UI: CrudUI = {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: false,
  import: false,
  export: false,
}

export function createCrud(
  config: CrudConfig,
): BuiltCrud {
  return {
    id: config.id ?? config.name ?? "crud",
    endpoint: config.endpoint,
    config,
    ui: {
      ...DEFAULT_UI,
      ...(config.ui ?? {}),
    },
    defaultQuery: {
      ...(config.defaultQuery ?? {}),
    },
  }
}