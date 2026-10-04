import type { CrudConfig } from "@framework"

export const candidateInterviewsConfig: CrudConfig = {
  id: "candidateInterviews",
  endpoint: "/api/hr/candidate-interviews/",
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