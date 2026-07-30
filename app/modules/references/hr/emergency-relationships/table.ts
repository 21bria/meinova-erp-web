import type { CrudConfig } from "@framework"

export const emergencyRelationshipsConfig: CrudConfig = {
  id: "emergencyRelationships",
  endpoint: "/api/administration/references/hr/emergency-relationships/",
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