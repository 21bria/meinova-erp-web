import type { CrudConfig } from "@framework"

export const travelRequestsConfig: CrudConfig = {
  id: "travelRequests",
  endpoint: "/api/hr/travel-requests/",
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