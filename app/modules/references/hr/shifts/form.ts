import { createForm, field } from "@framework"

export const shiftsForm = createForm([
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

  field.lookup("shift_group", "Shift Group", "/api/administration/references/hr/lookup/shift-groups/", {
      "tab": "general",
      "order": 30
    }),

  field.text("start_time", "Start Time", {
      "required": true,
      "tab": "general",
      "order": 40
    }),

  field.text("end_time", "End Time", {
      "required": true,
      "tab": "general",
      "order": 50
    }),

  field.text("break_start_time", "Break Start", {
      "tab": "general",
      "order": 60
    }),

  field.text("break_end_time", "Break End", {
      "tab": "general",
      "order": 70
    }),

  field.switch("crosses_midnight", "Crosses Midnight", {
      "tab": "general",
      "order": 80
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