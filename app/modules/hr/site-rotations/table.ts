import type { CrudConfig } from "@framework"

export const siteRotationsConfig: CrudConfig = {
  id: "siteRotations",
  endpoint: "/api/hr/site-rotations/",
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