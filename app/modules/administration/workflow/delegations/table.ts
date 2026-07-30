import type { CrudConfig } from "@framework"

export const delegationsConfig: CrudConfig = {
  id: "delegations",
  endpoint: "/api/administration/workflow/delegations/",
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