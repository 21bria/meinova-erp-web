import type { CrudConfig } from "@framework"

export const apiKeysConfig: CrudConfig = {
  id: "apiKeys",
  endpoint: "/api/administration/security/api-keys/",
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