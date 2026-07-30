import type { CrudConfig } from "@framework"

export const religionsConfig: CrudConfig = {
  id: "religions",
  endpoint: "/api/administration/references/hr/religions/",
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