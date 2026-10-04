import type { CrudConfig } from "@framework"

export const payrollRunsConfig: CrudConfig = {
  id: "payrollRuns",
  endpoint: "/api/payroll/payroll-runs/",
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