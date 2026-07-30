import type { CrudConfig } from "@framework"

export const interviewTypesConfig: CrudConfig = {
  id: "interviewTypes",
  endpoint: "/api/administration/references/hr/interview-types/",
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