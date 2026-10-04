import type { CrudConfig } from "@framework"

export const trainingParticipantsConfig: CrudConfig = {
  id: "trainingParticipants",
  endpoint: "/api/hr/training-participants/",
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