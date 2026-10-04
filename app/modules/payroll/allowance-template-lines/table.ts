import type { CrudConfig } from "@framework"

export const allowanceTemplateLinesConfig: CrudConfig = {
  id: "allowanceTemplateLines",
  endpoint: "/api/payroll/allowance-template-lines/",
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