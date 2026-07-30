import type { CrudConfig } from "@framework"

export const performanceCyclesConfig: CrudConfig = {
  id: "performanceCycles",
  endpoint: "/api/administration/references/hr/performance-cycles/",
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