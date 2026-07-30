import { createForm, field } from "@framework"

export const deductionTemplatesForm = createForm([
  field.text("code", "Code", {
      "required": true,
      "tab": "general"
    }),

  field.text("name", "Name", {
      "required": true,
      "tab": "general"
    }),

  field.textarea("description", "Description", {
      "layout": "full",
      "tab": "general"
    }),

  field.switch("is_active", "Is active", {
      "tab": "general"
    }),
], {
  columns: 2,
})