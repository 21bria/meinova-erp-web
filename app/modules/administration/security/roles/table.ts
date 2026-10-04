import type { CrudConfig } from "@framework"

export const rolesConfig: CrudConfig = {
  id: "roles",
  endpoint: "/api/accounts/roles/",
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