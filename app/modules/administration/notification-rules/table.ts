import type { CrudConfig } from "@framework"

export const notificationRulesConfig: CrudConfig = {
  id: "notificationRules",
  endpoint: "/api/notifications/rules/",
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