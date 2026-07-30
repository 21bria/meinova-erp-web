import type { CrudConfig } from "@framework"

export const kpiWeightTypesConfig: CrudConfig = {
  id: "kpiWeightTypes",
  endpoint: "/api/administration/references/hr/kpi-weight-types/",
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