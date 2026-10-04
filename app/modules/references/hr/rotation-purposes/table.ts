import type { CrudConfig } from "@framework"

export const rotationPurposesConfig: CrudConfig = {
  id: "rotationPurposes",
  endpoint: "/api/administration/references/hr/rotation-purposes/",
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