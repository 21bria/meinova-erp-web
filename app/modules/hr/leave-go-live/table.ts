import type { CrudConfig } from "@framework"

export const leaveGoLiveConfig: CrudConfig = {
  id: "leaveGoLive",
  endpoint: "/api/hr/leave-go-live/",
  defaultQuery: {},
  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: false,
  import: false,
  export: true,
},
}