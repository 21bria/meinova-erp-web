import type { CrudConfig } from "@framework"

export const approvalsConfig: CrudConfig = {
  id: "approvals",
  endpoint: "/api/administration/workflow/approvals/",
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