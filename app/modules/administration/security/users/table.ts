import type { CrudConfig } from "@framework"

export const usersConfig: CrudConfig = {
  id: "users",
  endpoint: "/api/accounts/users/",
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