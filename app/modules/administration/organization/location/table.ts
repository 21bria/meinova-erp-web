import type { CrudConfig } from "@framework"

export const locationConfig: CrudConfig = {
  id: "location",
  endpoint: "/api/administration/organization/location/",
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