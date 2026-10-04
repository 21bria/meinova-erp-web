import type { CrudConfig } from "@framework"

export const leavePoliciesConfig: CrudConfig = {
  id: "leavePolicies",
  endpoint: "/api/administration/references/hr/leave-policies/",
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