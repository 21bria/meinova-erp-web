import type { CrudConfig } from "@framework"

export const languageProficienciesConfig: CrudConfig = {
  id: "languageProficiencies",
  endpoint: "/api/administration/references/hr/language-proficiencies/",
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