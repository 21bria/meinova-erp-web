import type { CrudConfig } from "@framework"

export const workLocationTypesConfig: CrudConfig = {
  id: "workLocationTypes",
  endpoint: "/api/administration/references/hr/work-location-types/",
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