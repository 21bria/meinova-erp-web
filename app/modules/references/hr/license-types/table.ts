import type { CrudConfig } from "@framework"

export const licenseTypesConfig: CrudConfig = {
  id: "licenseTypes",
  endpoint: "/api/administration/references/hr/license-types/",
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