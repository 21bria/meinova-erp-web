import type { CrudConfig } from "@framework"

export const gradesConfig: CrudConfig = {
  id: "grades",
  endpoint: "/api/administration/references/hr/job-grades/",
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