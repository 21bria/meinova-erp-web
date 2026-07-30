import type { CrudConfig } from "@framework"

export const siteTypesConfig: CrudConfig = {
  id: "siteTypes",
  endpoint: "/api/administration/references/organization/site-types",
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