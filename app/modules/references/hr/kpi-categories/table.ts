import type { CrudConfig } from "@framework"

export const kpiCategoriesConfig: CrudConfig = {
  id: "kpiCategories",
  endpoint: "/api/administration/references/hr/kpi-categories/",
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