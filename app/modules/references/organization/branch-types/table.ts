import type { CrudConfig } from "@framework"

export const branchTypesConfig: CrudConfig = {
  id: "branchTypes",
  endpoint: "/api/administration/references/organization/branch-types",
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