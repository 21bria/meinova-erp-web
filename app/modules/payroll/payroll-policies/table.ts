import type { CrudConfig } from "@framework"

export const payrollPoliciesConfig: CrudConfig = {
  id: "payrollPolicies",
  endpoint: "/api/payroll/payroll-policies/",
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