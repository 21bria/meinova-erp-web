import type { CrudConfig } from "@framework"

export const tenantSettingsConfig: CrudConfig = {
  id: "tenantSettings",
  endpoint: "/api/administration/settings/tenant-settings/",
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