import type { CrudConfig } from "@framework"

export const bloodTypesConfig: CrudConfig = {
  id: "bloodTypes",
  endpoint: "/api/administration/references/hr/blood-types/",
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