import type { CrudConfig } from "@framework"

export const maritalStatusesConfig: CrudConfig = {
  id: "maritalStatuses",
  endpoint: "/api/administration/references/hr/marital-statuses/",
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