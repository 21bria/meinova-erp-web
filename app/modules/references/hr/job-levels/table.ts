import type { CrudConfig } from "@framework"

export const jobLevelsConfig: CrudConfig = {
  id: "jobLevels",
  endpoint: "/api/administration/references/hr/job-levels/",
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