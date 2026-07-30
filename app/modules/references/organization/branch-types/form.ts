import { createForm, field } from "@framework"

export const branchTypesForm = createForm([
  field.switch("is_active", "Is active", {
      "tab": "general"
    }),

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

  field.text("sort_order", "Sort order", {
      "tab": "general"
    }),
], {
  columns: 2,
})