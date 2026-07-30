import type { CrudConfig } from "@framework"

export const trainingCategoryConfig: CrudConfig = {
  id: "trainingCategory",
  endpoint: "/api/administration/references/hr/training-category/",
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