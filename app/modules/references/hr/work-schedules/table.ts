import type { CrudConfig } from "@framework"

export const workSchedulesConfig: CrudConfig = {
  id: "workSchedules",
  endpoint: "/api/administration/references/hr/work-schedules/",
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