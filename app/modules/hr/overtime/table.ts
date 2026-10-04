import type { CrudConfig } from "@framework"

export const overtimeConfig: CrudConfig = {
  id: "overtime",
  endpoint: "/api/hr/overtimes/",
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