import type { CrudConfig } from "@framework"

export const trainingProviderConfig: CrudConfig = {
  id: "trainingProvider",
  endpoint: "/api/administration/references/hr/training-provider/",
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