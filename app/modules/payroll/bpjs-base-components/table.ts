import type { CrudConfig } from "@framework"

export const bpjsBaseComponentsConfig: CrudConfig = {
  id: "bpjsBaseComponents",
  endpoint: "/api/payroll/bpjs-base-components/",
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