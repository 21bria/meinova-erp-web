import type { CrudConfig } from "@framework"

export const divisionConfig: CrudConfig = {
  id: "division",
  endpoint: "/api/administration/organization/division/",
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