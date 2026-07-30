import type { CrudConfig } from "@framework"

export const shiftGroupsConfig: CrudConfig = {
  id: "shiftGroups",
  endpoint: "/api/administration/references/hr/shift-groups/",
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