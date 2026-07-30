import type { CrudConfig } from "@framework"

export const payrollGroupsConfig: CrudConfig = {
  id: "payrollGroups",
  endpoint: "/api/payroll/payroll-groups/",
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