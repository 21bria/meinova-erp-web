import { createForm, field } from "@framework"

export const workSchedulesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "references.hr.work-schedules.fields.code",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "references.hr.work-schedules.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.textarea("description", "Description", {
      "labelKey": "references.hr.work-schedules.fields.description",
      "default": "",
      "rows": 4,
      "layout": "full",
      "tab": "general",
      "order": 30
    }),

  field.select("schedule_type", "Schedule Type", {
      "labelKey": "references.hr.work-schedules.fields.schedule_type",
      "default": "WEEKLY",
      "multiple": false,
      "tab": "general",
      "order": 40,
      "options": [
        {
          "value": "WEEKLY",
          "label": "Weekly"
        },
        {
          "value": "ROSTER",
          "label": "Roster"
        },
        {
          "value": "FLEXIBLE",
          "label": "Flexible"
        }
      ]
    }),

  field.number("standard_hours_per_day", "Standard Hours per Day", {
      "labelKey": "references.hr.work-schedules.fields.standard_hours_per_day",
      "default": 8,
      "tab": "general",
      "order": 50
    }),

  field.number("standard_hours_per_week", "Standard Hours per Week", {
      "labelKey": "references.hr.work-schedules.fields.standard_hours_per_week",
      "default": 40,
      "tab": "general",
      "order": 60
    }),

  field.number("work_days", "Work Days", {
      "labelKey": "references.hr.work-schedules.fields.work_days",
      "hint": "Jumlah hari kerja dalam satu minggu atau siklus.",
      "default": 5,
      "tab": "general",
      "order": 70
    }),

  field.number("cycle_work_days", "Cycle Work Days", {
      "labelKey": "references.hr.work-schedules.fields.cycle_work_days",
      "hint": "Jumlah hari kerja pada pola roster, misalnya 14.",
      "tab": "general",
      "order": 80
    }),

  field.number("cycle_off_days", "Cycle Off Days", {
      "labelKey": "references.hr.work-schedules.fields.cycle_off_days",
      "hint": "Jumlah hari libur pada pola roster, misalnya 14.",
      "tab": "general",
      "order": 90
    }),

  field.number("sort_order", "Sort order", {
      "labelKey": "references.hr.work-schedules.fields.sort_order",
      "default": 0,
      "tab": "general"
    }),

  field.switch("is_flexible", "Flexible", {
      "labelKey": "references.hr.work-schedules.fields.is_flexible",
      "default": false,
      "tab": "general",
      "order": 100
    }),

  field.switch("crosses_midnight", "Crosses Midnight", {
      "labelKey": "references.hr.work-schedules.fields.crosses_midnight",
      "default": false,
      "tab": "general",
      "order": 110
    }),

  field.switch("is_active", "Active", {
      "labelKey": "references.hr.work-schedules.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})