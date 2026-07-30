import type { CrudConfig } from "@framework"

export const competenciesConfig: CrudConfig = {
  id: "competencies",
  endpoint: "/api/administration/references/hr/competencies/",
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