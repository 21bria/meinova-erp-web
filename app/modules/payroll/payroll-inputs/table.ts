import type { CrudConfig } from "@framework"

export const payrollInputsConfig: CrudConfig = {
  id: "payrollInputs",
  endpoint: "/api/payroll/payroll-inputs/",
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