import type { CrudConfig } from "@framework"

export const overtimeTypesConfig: CrudConfig = {
  id: "overtimeTypes",
  endpoint: "/api/administration/references/hr/overtime-types/",
  defaultQuery: {},
  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: false,
  import: false,
  export: false,
},
}