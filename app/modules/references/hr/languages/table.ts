import type { CrudConfig } from "@framework"

export const languagesConfig: CrudConfig = {
  id: "languages",
  endpoint: "/api/administration/references/hr/languages/",
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