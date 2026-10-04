import type { CrudConfig } from "@framework"

export const payslipsConfig: CrudConfig = {
  id: "payslips",
  endpoint: "/api/payroll/payslips/",
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