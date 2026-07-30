import type { CrudConfig } from "@framework"

export const skillsConfig: CrudConfig = {
  id: "skills",
  endpoint: "/api/administration/references/hr/skills/",
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