import type { CrudConfig } from "@framework"

export const rosterSetupsConfig: CrudConfig = {
  id: "rosterSetups",
  endpoint: "/api/hr/roster-setups/",
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