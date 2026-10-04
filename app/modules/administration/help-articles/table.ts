import type { CrudConfig } from "@framework"

export const helpArticlesConfig: CrudConfig = {
  id: "helpArticles",
  endpoint: "/api/helpcenter/articles/",
  defaultQuery: {},
  ui: {
  create: true,
  edit: true,
  delete: true,
  bulk_delete: true,
  import: false,
  export: true,
},
}