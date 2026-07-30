import type { CrudConfig } from "@framework"

export const exitClearanceStatusesConfig: CrudConfig = {
  id: "exitClearanceStatuses",
  endpoint: "/api/administration/references/hr/exit-clearance-statuses/",
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