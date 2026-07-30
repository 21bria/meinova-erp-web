import type { CrudConfig } from "@framework"

export const employmentGroupsConfig: CrudConfig = {
  id: "employmentGroups",
  endpoint: "/api/administration/references/hr/employment-groups/",
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