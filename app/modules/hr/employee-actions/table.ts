import type { CrudConfig } from "@framework"

export const employeeActionsConfig: CrudConfig = {
  id: "employeeActions",
  endpoint: "/api/hr/employee-actions/",
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