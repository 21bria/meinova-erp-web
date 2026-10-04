import type { CrudConfig } from "@framework"

export const emailTemplatesConfig: CrudConfig = {
  id: "emailTemplates",
  endpoint: "/api/notifications/templates/",
  defaultQuery: {},
  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: true,
  import: false,
  export: true,
},
}