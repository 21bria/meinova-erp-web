import type { CrudConfig } from "@framework"

export const provincesConfig: CrudConfig = {
  id: "provinces",
  endpoint: "/api/administration/references/geography/provinces/",
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