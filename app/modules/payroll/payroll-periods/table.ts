import type { CrudConfig } from "@framework"

export const payrollPeriodsConfig: CrudConfig = {
  id: "payrollPeriods",
  endpoint: "/api/payroll/payroll-periods/",
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