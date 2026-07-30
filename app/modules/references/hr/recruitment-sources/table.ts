import type { CrudConfig } from "@framework"

export const recruitmentSourcesConfig: CrudConfig = {
  id: "recruitmentSources",
  endpoint: "/api/administration/references/hr/recruitment-sources/",
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