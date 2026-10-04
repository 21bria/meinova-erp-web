import type { CrudConfig } from "@framework"

export const payrollSettingsConfig: CrudConfig = {
  id: "payrollSettings",
  endpoint: "/api/payroll/payroll-settings/",
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