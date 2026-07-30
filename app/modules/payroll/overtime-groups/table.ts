import type { CrudConfig } from "@framework"

export const overtimeGroupsConfig: CrudConfig = {
  id: "overtimeGroups",
  endpoint: "/api/payroll/overtime-groups/",
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