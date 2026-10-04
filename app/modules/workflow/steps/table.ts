import type { CrudConfig } from "@framework"

export const stepsConfig: CrudConfig = {
  id: "steps",
  endpoint: "/api/workflow/steps/",
  defaultQuery: {},
  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: true,
  import: false,
  export: false,
},
}