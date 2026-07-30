import type { CrudConfig } from "@framework"

export const certificateTypesConfig: CrudConfig = {
  id: "certificateTypes",
  endpoint: "/api/administration/references/hr/certificate-types/",
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