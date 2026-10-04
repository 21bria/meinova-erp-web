import type { CrudConfig } from "@framework"

export const facilityTypesConfig: CrudConfig = {
  id: "facilityTypes",
  endpoint: "/api/administration/references/organization/facility-types/",
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