import type { CrudConfig } from "@framework"

export const countriesConfig: CrudConfig = {
  id: "countries",
  endpoint: "/api/administration/references/geography/countries/",
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