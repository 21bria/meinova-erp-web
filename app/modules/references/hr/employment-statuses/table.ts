import type { CrudConfig } from "@framework"

export const employmentStatusesConfig: CrudConfig = {
  id: "employmentStatuses",
  endpoint: "/api/administration/references/hr/employment-statuses/",
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