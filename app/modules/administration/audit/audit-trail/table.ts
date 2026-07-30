import type { CrudConfig } from "@framework"

export const auditTrailConfig: CrudConfig = {
  id: "auditTrail",
  endpoint: "/api/administration/audit/trails/",
  defaultQuery: {},
  ui: {
  create: false,
  edit: false,
  delete: false,
  bulk_delete: false,
  import: false,
  export: true,
},
}