import type { CrudConfig } from "@framework"

export const payrollRunEmployeesConfig: CrudConfig = {
  id: "payrollRunEmployees",
  endpoint: "/api/payroll/payroll-run-employees/",
  defaultQuery: {},
  ui: {
  create: false,
  edit: true,
  delete: false,
  bulk_delete: false,
  import: false,
  export: true,
},
}