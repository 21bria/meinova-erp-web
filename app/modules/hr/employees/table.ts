import type { CrudConfig } from "@framework"

export const employeesConfig: CrudConfig = {
  id: "employees",
  endpoint: "/api/hr/employees/",
  defaultQuery: {},
  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: true,
  import: true,
  export: true,
},
}