import { createForm, field } from "@framework"

export const approvalsForm = createForm([
  field.textarea("notes", "Notes", {
      "layout": "full",
      "tab": "general"
    }),
], {
  columns: 2,
})