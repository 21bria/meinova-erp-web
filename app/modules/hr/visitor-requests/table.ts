import type { CrudConfig } from "@framework"

export const visitorRequestsConfig: CrudConfig = {
  id: "visitorRequests",
  endpoint: "/api/hr/visitor-requests/",
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