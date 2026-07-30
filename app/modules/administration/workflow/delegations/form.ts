import { createForm, field } from "@framework"

export const delegationsForm = createForm([
  field.switch("is_active", "Is active", {
      "tab": "general"
    }),

  field.date("start_date", "Start date", {
      "required": true,
      "tab": "general"
    }),

  field.date("end_date", "End date", {
      "required": true,
      "tab": "general"
    }),

  field.text("reason", "Reason", {
      "tab": "general"
    }),
], {
  columns: 2,
})