import type { CrudConfig } from "@framework"

export const citiesConfig: CrudConfig = {
  id: "cities",
  endpoint: "/api/administration/references/geography/cities/",
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