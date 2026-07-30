import type { CrudConfig } from "@framework"

export const employmentTypesConfig: CrudConfig = {
  id: "employmentTypes",
  endpoint: "/api/administration/references/hr/employment-types/",
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