import type { CrudConfig } from "@framework"

export const leaveBalancesConfig: CrudConfig = {
  id: "leaveBalances",
  endpoint: "/api/hr/leave-balances/",
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