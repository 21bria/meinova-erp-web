import type { CrudConfig } from "@framework"

export const companyConfig: CrudConfig = {
  id: "company",
  endpoint: "/api/administration/organization/company/",
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