import type { CrudConfig } from "@framework"

export const districtsConfig: CrudConfig = {
  id: "districts",
  endpoint: "/api/administration/references/geography/districts/",
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