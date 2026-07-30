import type { CrudConfig } from "@framework"

export const nationalitiesConfig: CrudConfig = {
  id: "nationalities",
  endpoint: "/api/administration/references/hr/nationalities/",
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