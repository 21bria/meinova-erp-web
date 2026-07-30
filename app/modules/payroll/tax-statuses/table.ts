import type { CrudConfig } from "@framework"

export const taxStatusesConfig: CrudConfig = {
  id: "taxStatuses",
  endpoint: "/api/payroll/tax-statuses/",
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