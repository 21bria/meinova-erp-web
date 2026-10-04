import type { CrudConfig } from "@framework"

export const printSettingsConfig: CrudConfig = {
  id: "printSettings",
  endpoint: "/api/administration/settings/print-settings/",
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