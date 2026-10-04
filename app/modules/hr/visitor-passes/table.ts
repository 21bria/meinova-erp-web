import type { CrudConfig } from "@framework"

export const visitorPassesConfig: CrudConfig = {
  id: "visitorPasses",
  endpoint: "/api/hr/visitor-passes/",
  defaultQuery: {},
  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: false,
  import: false,
  export: true,
},
}