import type { CrudConfig } from "@framework"

export const rosterPoliciesConfig: CrudConfig = {
  id: "rosterPolicies",
  endpoint: "/api/administration/references/hr/roster-policies/",
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