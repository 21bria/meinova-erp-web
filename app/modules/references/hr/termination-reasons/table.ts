import type { CrudConfig } from "@framework"

export const terminationReasonsConfig: CrudConfig = {
  id: "terminationReasons",
  endpoint: "/api/administration/references/hr/termination-reasons/",
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