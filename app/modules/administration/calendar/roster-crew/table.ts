import type { CrudConfig } from "@framework"

export const rosterCrewConfig: CrudConfig = {
  id: "rosterCrew",
  endpoint: "/api/administration/calendar/roster-crews/",
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