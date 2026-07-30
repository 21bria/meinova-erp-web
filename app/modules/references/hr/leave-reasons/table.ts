import type { CrudConfig } from "@framework"

export const leaveReasonsConfig: CrudConfig = {
  id: "leaveReasons",
  endpoint: "/api/administration/references/hr/leave-reasons/",
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