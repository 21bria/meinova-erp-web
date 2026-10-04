import type { CrudConfig } from "@framework"

export const deductionTemplateLinesConfig: CrudConfig = {
  id: "deductionTemplateLines",
  endpoint: "/api/payroll/deduction-template-lines/",
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