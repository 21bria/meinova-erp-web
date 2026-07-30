import type { CrudConfig } from "@framework"

export const performanceTemplatesConfig: CrudConfig = {
  id: "performanceTemplates",
  endpoint: "/api/administration/references/hr/performance-templates/",
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