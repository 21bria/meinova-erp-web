import type { CrudConfig } from "@framework"

export const recruitmentConfig: CrudConfig = {
  id: "recruitment",
  endpoint: "/api/hr/job-vacancies/",
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