import type { CrudConfig } from "@framework"

export const facilityConfig: CrudConfig = {
  id: "facility",
  endpoint: "/api/administration/organization/facility/",
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