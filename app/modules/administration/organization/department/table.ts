import type { CrudConfig } from "@framework"

export const departmentConfig: CrudConfig = {
  id: "department",
  endpoint: "/api/administration/organization/department/",
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