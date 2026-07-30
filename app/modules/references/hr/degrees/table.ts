import type { CrudConfig } from "@framework"

export const degreesConfig: CrudConfig = {
  id: "degrees",
  endpoint: "/api/administration/references/hr/degrees/",
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