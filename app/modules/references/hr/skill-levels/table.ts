import type { CrudConfig } from "@framework"

export const skillLevelsConfig: CrudConfig = {
  id: "skillLevels",
  endpoint: "/api/administration/references/hr/skill-levels/",
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