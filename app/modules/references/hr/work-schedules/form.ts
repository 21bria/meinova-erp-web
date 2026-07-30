import { createForm, field } from "@framework"

export const workSchedulesForm = createForm([
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

  field.text("schedule_type", "Schedule Type", {
      "tab": "general",
      "order": 40
    }),

  field.text("standard_hours_per_day", "Standard Hours per Day", {
      "tab": "general",
      "order": 50
    }),

  field.text("standard_hours_per_week", "Standard Hours per Week", {
      "tab": "general",
      "order": 60
    }),

  field.text("work_days", "Work Days", {
      "tab": "general",
      "order": 70
    }),

  field.text("cycle_work_days", "Cycle Work Days", {
      "tab": "general",
      "order": 80
    }),

  field.text("cycle_off_days", "Cycle Off Days", {
      "tab": "general",
      "order": 90
    }),

  field.text("sort_order", "Sort order", {
      "tab": "general"
    }),

  field.switch("is_flexible", "Flexible", {
      "tab": "general",
      "order": 100
    }),

  field.switch("crosses_midnight", "Crosses Midnight", {
      "tab": "general",
      "order": 110
    }),

  field.switch("is_active", "Active", {
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})