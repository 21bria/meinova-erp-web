import type { CrudConfig } from "@framework"

export const instancesConfig: CrudConfig = {
  id: "instances",
  endpoint: "/api/workflow/instances/",
  defaultQuery: {},
  ui: {
  create: false,
  edit: false,
  delete: false,
  bulk_delete: false,
  import: false,
  export: true,
},
}