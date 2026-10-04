import type { CrudConfig } from "@framework"

export const overtimeGroupTiersConfig: CrudConfig = {
  id: "overtimeGroupTiers",
  endpoint: "/api/payroll/overtime-group-tiers/",
  defaultQuery: {},
  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: false,
  import: false,
  export: true,
},
}