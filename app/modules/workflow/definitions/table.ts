import type { CrudConfig } from "@framework"

export const definitionsConfig: CrudConfig = {
  id: "definitions",
  endpoint: "/api/workflow/definitions/",
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