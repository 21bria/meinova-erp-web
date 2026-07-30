import type { CrudConfig } from "@framework"

export const kpiPeriodsConfig: CrudConfig = {
  id: "kpiPeriods",
  endpoint: "/api/administration/references/hr/kpi-periods/",
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