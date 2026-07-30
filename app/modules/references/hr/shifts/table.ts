import type { CrudConfig } from "@framework"

export const shiftsConfig: CrudConfig = {
  id: "shifts",
  endpoint: "/api/administration/references/hr/shifts/",
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