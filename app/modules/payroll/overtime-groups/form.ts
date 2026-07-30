import { createForm, field } from "@framework"

export const overtimeGroupsForm = createForm([
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

  field.text("hourly_multiplier", "Hourly multiplier", {
      "tab": "general"
    }),

  field.text("maximum_hours_per_day", "Maximum hours per day", {
      "tab": "general"
    }),

  field.text("maximum_hours_per_month", "Maximum hours per month", {
      "tab": "general"
    }),

  field.switch("is_active", "Is active", {
      "tab": "general"
    }),
], {
  columns: 2,
})