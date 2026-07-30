import type { CrudConfig } from "@framework"

export const instancesConfig: CrudConfig = {
  id: "instances",
  endpoint: "/api/administration/workflow/instances/",
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