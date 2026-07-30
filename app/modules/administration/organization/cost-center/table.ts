import type { CrudConfig } from "@framework"

export const costCenterConfig: CrudConfig = {
  id: "costCenter",
  endpoint: "/api/administration/organization/cost-center/",
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