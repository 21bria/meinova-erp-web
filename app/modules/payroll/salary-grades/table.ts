import type { CrudConfig } from "@framework"

export const salaryGradesConfig: CrudConfig = {
  id: "salaryGrades",
  endpoint: "/api/payroll/salary-grades/",
  defaultQuery: {},
  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: false,
  import: false,
  export: false,
},
}