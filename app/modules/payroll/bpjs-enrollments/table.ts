import type { CrudConfig } from "@framework"

export const bpjsEnrollmentsConfig: CrudConfig = {
  id: "bpjsEnrollments",
  endpoint: "/api/payroll/bpjs-enrollments/",
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