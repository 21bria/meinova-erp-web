import type { CrudConfig } from "@framework"

export const positionConfig: CrudConfig = {
  id: "position",
  endpoint: "/api/administration/organization/position/",
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