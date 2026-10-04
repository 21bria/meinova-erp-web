import type { CrudConfig } from "@framework"

export const externalVisitorsConfig: CrudConfig = {
  id: "externalVisitors",
  endpoint: "/api/hr/external-visitors/",
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