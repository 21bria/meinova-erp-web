import type { CrudConfig } from "@framework"

export const bpjsRiskClassesConfig: CrudConfig = {
  id: "bpjsRiskClasses",
  endpoint: "/api/payroll/bpjs-risk-classes/",
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