import type { CrudConfig } from "@framework"

export const attendanceStatusesConfig: CrudConfig = {
  id: "attendanceStatuses",
  endpoint: "/api/administration/references/hr/attendance-statuses/",
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