import type { CrudConfig } from "@framework"

export const companyTypesConfig: CrudConfig = {
  id: "companyTypes",
  endpoint: "/api/administration/references/organization/company-types",
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