import type { CrudConfig } from "@framework"

export const helpCategoriesConfig: CrudConfig = {
  id: "helpCategories",
  endpoint: "/api/helpcenter/categories/",
  defaultQuery: {},
  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: true,
  import: false,
  export: true,
},
}