import type { CrudConfig } from "@framework"

export const shiftAssignmentsConfig: CrudConfig = {
  id: "shiftAssignments",
  endpoint: "/api/hr/shift-assignments/",
  defaultQuery: {},
  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: false,
  import: false,
  export: true,
},
}