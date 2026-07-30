import type { CrudConfig } from "@framework"

export const competencyLevelsConfig: CrudConfig = {
  id: "competencyLevels",
  endpoint: "/api/administration/references/hr/competency-levels/",
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