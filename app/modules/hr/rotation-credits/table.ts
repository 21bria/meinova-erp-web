import type { CrudConfig } from "@framework"

export const rotationCreditsConfig: CrudConfig = {
  id: "rotationCredits",
  endpoint: "/api/hr/rotation-credits/",
  defaultQuery: {},
  ui: {
  create: true,
  edit: false,
  delete: false,
  bulk_delete: false,
  import: false,
  export: true,
},
}