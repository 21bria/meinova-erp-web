import type { CrudConfig } from "@framework"

export const holidayConfig: CrudConfig = {
  id: "holiday",
  endpoint: "/api/administration/calendar/holidays/",
  defaultQuery: {},
  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: true,
  import: true,
  export: true,
},
}