import type { CrudConfig } from "@framework"

export const workCalendarConfig: CrudConfig = {
  id: "workCalendar",
  endpoint: "/api/administration/calendar/work-calendars/",
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