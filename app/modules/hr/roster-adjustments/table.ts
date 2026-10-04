import type { CrudConfig } from "@framework"

export const rosterAdjustmentsConfig: CrudConfig = {
  id: "rosterAdjustments",
  endpoint: "/api/hr/roster-adjustments/",
  defaultQuery: {},
  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: true,
  import: false,
  export: true,
},
}