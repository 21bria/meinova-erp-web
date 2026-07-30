import type { CrudConfig } from "@framework"

export const currencyConfig: CrudConfig = {
  id: "currency",
  endpoint: "/api/administration/currency/",
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