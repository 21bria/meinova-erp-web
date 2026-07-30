import type { CrudConfig } from "@framework"

export const contractTypesConfig: CrudConfig = {
  id: "contractTypes",
  endpoint: "/api/administration/references/hr/contract-types/",
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