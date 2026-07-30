import type { CrudConfig } from "@framework"

export const studyFieldsConfig: CrudConfig = {
  id: "studyFields",
  endpoint: "/api/administration/references/hr/study-fields/",
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