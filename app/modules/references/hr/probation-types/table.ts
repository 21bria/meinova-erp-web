import type { CrudConfig } from "@framework"

export const probationTypesConfig: CrudConfig = {
  id: "probationTypes",
  endpoint: "/api/administration/references/hr/probation-types/",
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