import type { CrudConfig } from "@framework"

export const allowanceTemplatesConfig: CrudConfig = {
  id: "allowanceTemplates",
  endpoint: "/api/payroll/allowance-templates/",
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