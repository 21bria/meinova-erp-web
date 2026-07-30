import type { CrudConfig } from "@framework"

export const bankBranchesConfig: CrudConfig = {
  id: "bankBranches",
  endpoint: "/api/administration/references/bank/bank-branches/",
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