import { createForm, field } from "@framework"

export const shiftGroupsForm = createForm([
  field.text("code", "Code", {
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.textarea("description", "Description", {
      "rows": 4,
      "layout": "full",
      "tab": "general",
      "order": 30
    }),

  field.text("sort_order", "Sort order", {
      "tab": "general"
    }),

  field.switch("is_active", "Active", {
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})