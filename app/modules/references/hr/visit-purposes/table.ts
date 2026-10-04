import type { CrudConfig } from "@framework"

export const visitPurposesConfig: CrudConfig = {
  id: "visitPurposes",
  endpoint: "/api/administration/references/hr/visit-purposes/",
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