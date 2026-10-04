import type { CrudConfig } from "@framework"

export const candidatesConfig: CrudConfig = {
  id: "candidates",
  endpoint: "/api/hr/candidates/",
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