import type { CrudConfig } from "@framework"

export const branchConfig: CrudConfig = {
  id: "branch",
  endpoint: "/api/administration/organization/branch/",
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