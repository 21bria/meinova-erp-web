import type { CrudConfig } from "@framework"

export const trainingConfig: CrudConfig = {
  id: "training",
  endpoint: "/api/hr/training-programs/",
  defaultQuery: {},
  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: true,
  import: false,
  export: true,
},
}