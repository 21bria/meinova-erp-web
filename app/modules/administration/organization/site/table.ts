import type { CrudConfig } from "@framework"

export const siteConfig: CrudConfig = {
  id: "site",
  endpoint: "/api/administration/organization/site/",
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