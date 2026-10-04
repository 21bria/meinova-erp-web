import type { CrudConfig } from "@framework"

export const rosterSetupLinesConfig: CrudConfig = {
  id: "rosterSetupLines",
  endpoint: "/api/hr/roster-setup-lines/",
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