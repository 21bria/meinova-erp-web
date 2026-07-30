import type { CrudConfig } from "@framework"

export const sectionConfig: CrudConfig = {
  id: "section",
  endpoint: "/api/administration/organization/section/",
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