import type { CrudConfig } from "@framework"

export const familyRelationshipsConfig: CrudConfig = {
  id: "familyRelationships",
  endpoint: "/api/administration/references/hr/family-relationships/",
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