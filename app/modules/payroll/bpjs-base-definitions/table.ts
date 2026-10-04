import type { CrudConfig } from "@framework"

export const bpjsBaseDefinitionsConfig: CrudConfig = {
  id: "bpjsBaseDefinitions",
  endpoint: "/api/payroll/bpjs-base-definitions/",
  defaultQuery: {},
  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: false,
  import: false,
  export: true,
},
}