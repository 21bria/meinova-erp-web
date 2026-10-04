import type { CrudConfig } from "@framework"

export const attendancePoliciesConfig: CrudConfig = {
  id: "attendancePolicies",
  endpoint: "/api/administration/references/hr/attendance-policies/",
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