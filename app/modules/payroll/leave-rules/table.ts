import type { CrudConfig } from "@framework"

export const leaveRulesConfig: CrudConfig = {
  id: "leaveRules",
  endpoint: "/api/payroll/leave-rules/",
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