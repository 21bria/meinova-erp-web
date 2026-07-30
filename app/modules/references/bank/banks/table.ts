import type { CrudConfig } from "@framework"

export const banksConfig: CrudConfig = {
  id: "banks",
  endpoint: "/api/administration/references/bank/banks/",
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