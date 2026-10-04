import { createForm, field } from "@framework"

export const shiftsForm = createForm([
  field.text("code", "Code", {
      "labelKey": "references.hr.shifts.fields.code",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "references.hr.shifts.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.textarea("description", "Description", {
      "labelKey": "references.hr.shifts.fields.description",
      "default": "",
      "rows": 4,
      "layout": "full",
      "tab": "general",
      "order": 30
    }),

  field.lookup("shift_group", "Shift Group", "/api/administration/references/hr/lookup/shift-groups/", {
      "labelKey": "references.hr.shifts.fields.shift_group",
      "tab": "general",
      "order": 30
    }),

  field.time("start_time", "Start Time", {
      "labelKey": "references.hr.shifts.fields.start_time",
      "required": true,
      "tab": "general",
      "order": 40
    }),

  field.time("end_time", "End Time", {
      "labelKey": "references.hr.shifts.fields.end_time",
      "required": true,
      "tab": "general",
      "order": 50
    }),

  field.time("break_start_time", "Break Start", {
      "labelKey": "references.hr.shifts.fields.break_start_time",
      "tab": "general",
      "order": 60
    }),

  field.time("break_end_time", "Break End", {
      "labelKey": "references.hr.shifts.fields.break_end_time",
      "tab": "general",
      "order": 70
    }),

  field.switch("crosses_midnight", "Crosses Midnight", {
      "labelKey": "references.hr.shifts.fields.crosses_midnight",
      "default": false,
      "tab": "general",
      "order": 80
    }),

  field.number("sort_order", "Sort order", {
      "labelKey": "references.hr.shifts.fields.sort_order",
      "default": 0,
      "tab": "general"
    }),

  field.switch("is_active", "Active", {
      "labelKey": "references.hr.shifts.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})