import type { CrudConfig } from "@framework"

export const deductionTemplatesConfig: CrudConfig = {
  id: "deductionTemplates",
  endpoint: "/api/payroll/deduction-templates/",
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