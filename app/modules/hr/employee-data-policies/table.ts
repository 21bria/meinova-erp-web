import type { CrudConfig } from "@framework"

export const employeeDataPoliciesConfig: CrudConfig = {
  id: "employeeDataPolicies",
  endpoint: "/api/administration/references/hr/employee-data-policies/",
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