import type { CrudConfig } from "@framework"

export const candidateStatusesConfig: CrudConfig = {
  id: "candidateStatuses",
  endpoint: "/api/administration/references/hr/candidate-statuses/",
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