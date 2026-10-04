import type { CrudConfig } from "@framework"

export const bpjsRulesConfig: CrudConfig = {
  id: "bpjsRules",
  endpoint: "/api/payroll/bpjs-rules/",
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