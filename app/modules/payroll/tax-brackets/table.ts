import type { CrudConfig } from "@framework"

export const taxBracketsConfig: CrudConfig = {
  id: "taxBrackets",
  endpoint: "/api/payroll/tax-brackets/",
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