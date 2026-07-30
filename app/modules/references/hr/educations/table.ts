import type { CrudConfig } from "@framework"

export const educationsConfig: CrudConfig = {
  id: "educations",
  endpoint: "/api/administration/references/hr/educations/",
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