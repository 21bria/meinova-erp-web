import type { CrudConfig } from "@framework"

export const notificationLogsConfig: CrudConfig = {
  id: "notificationLogs",
  endpoint: "/api/notifications/logs/",
  defaultQuery: {},
  ui: {
  create: false,
  edit: false,
  delete: false,
  bulk_delete: false,
  import: false,
  export: true,
},
}