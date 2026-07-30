import type { CrudConfig } from "@framework"

export const gendersConfig: CrudConfig = {
  id: "genders",
  endpoint: "/api/administration/references/hr/genders/",
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