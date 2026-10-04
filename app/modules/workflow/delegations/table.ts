import type { CrudConfig } from "@framework"

export const delegationsConfig: CrudConfig = {
  id: "delegations",
  endpoint: "/api/workflow/delegations/",
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