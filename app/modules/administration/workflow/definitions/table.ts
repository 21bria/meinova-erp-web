import type { CrudConfig } from "@framework"

export const definitionsConfig: CrudConfig = {
  id: "definitions",
  endpoint: "/api/administration/workflow/definitions/",
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