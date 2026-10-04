import type { CrudConfig } from "@framework"

export const villagesConfig: CrudConfig = {
  id: "villages",
  endpoint: "/api/administration/references/geography/villages/",
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