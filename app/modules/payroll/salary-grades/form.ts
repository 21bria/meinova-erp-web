import { createForm, field } from "@framework"

export const salaryGradesForm = createForm([
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

  field.text("minimum_salary", "Minimum salary", {
      "tab": "general"
    }),

  field.text("maximum_salary", "Maximum salary", {
      "tab": "general"
    }),

  field.switch("is_active", "Is active", {
      "tab": "general"
    }),
], {
  columns: 2,
})