import type { CrudConfig } from "@framework"

export const permissionsConfig: CrudConfig = {
  id: "permissions",
  endpoint: "/api/accounts/permissions/",
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