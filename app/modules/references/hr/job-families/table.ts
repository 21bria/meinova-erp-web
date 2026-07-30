import type { CrudConfig } from "@framework"

export const jobFamiliesConfig: CrudConfig = {
  id: "jobFamilies",
  endpoint: "/api/administration/references/hr/job-families/",
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