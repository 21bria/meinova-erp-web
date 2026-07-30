import type { CrudConfig } from "@framework"

export const rejectionReasonsConfig: CrudConfig = {
  id: "rejectionReasons",
  endpoint: "/api/administration/references/hr/rejection-reasons/",
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