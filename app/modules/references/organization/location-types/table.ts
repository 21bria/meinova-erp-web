import type { CrudConfig } from "@framework"

export const locationTypesConfig: CrudConfig = {
  id: "locationTypes",
  endpoint: "/api/administration/references/organization/location-types",
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