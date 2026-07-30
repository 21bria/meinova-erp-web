import type { CrudConfig } from "@framework"

export const competencyCategoriesConfig: CrudConfig = {
  id: "competencyCategories",
  endpoint: "/api/administration/references/hr/competency-categories/",
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