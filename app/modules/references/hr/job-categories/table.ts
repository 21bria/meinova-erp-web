import type { CrudConfig } from "@framework"

export const jobCategoriesConfig: CrudConfig = {
  id: "jobCategories",
  endpoint: "/api/administration/references/hr/job-categories/",
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