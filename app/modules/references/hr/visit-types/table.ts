import type { CrudConfig } from "@framework"

export const visitTypesConfig: CrudConfig = {
  id: "visitTypes",
  endpoint: "/api/administration/references/hr/visit-types/",
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