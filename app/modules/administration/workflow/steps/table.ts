import type { CrudConfig } from "@framework"

export const stepsConfig: CrudConfig = {
  id: "steps",
  endpoint: "/api/administration/workflow/steps/",
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