import type { CrudConfig } from "@framework"

export const employeeActionPoliciesConfig: CrudConfig = {
  id: "employeeActionPolicies",
  endpoint: "/api/administration/references/hr/employee-action-policies/",
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