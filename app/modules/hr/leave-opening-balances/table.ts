import type { CrudConfig } from "@framework"

export const leaveOpeningBalancesConfig: CrudConfig = {
  id: "leaveOpeningBalances",
  endpoint: "/api/hr/leave-opening-balances/",
  defaultQuery: {},
  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: true,
  import: true,
  export: true,
},
}