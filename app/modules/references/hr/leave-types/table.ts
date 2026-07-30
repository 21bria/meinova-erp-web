import type { CrudConfig } from "@framework"

export const leaveTypesConfig: CrudConfig = {
  id: "leaveTypes",
  endpoint: "/api/administration/references/hr/leave-types/",
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