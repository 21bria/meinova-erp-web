import type { CrudConfig } from "@framework"

export const bpjsProgramsConfig: CrudConfig = {
  id: "bpjsPrograms",
  endpoint: "/api/payroll/bpjs-programs/",
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