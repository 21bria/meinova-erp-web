import { createForm, field } from "@framework"

export const performanceCyclesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "references.hr.performance-cycles.fields.code",
      "required": true,
      "placeholder": "e.g. CODE",
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "references.hr.performance-cycles.fields.name",
      "required": true,
      "placeholder": "Name",
      "tab": "general",
      "order": 20
    }),

  field.textarea("description", "Description", {
      "labelKey": "references.hr.performance-cycles.fields.description",
      "default": "",
      "rows": 4,
      "layout": "full",
      "tab": "general",
      "order": 30
    }),

  field.number("sort_order", "Sort order", {
      "labelKey": "references.hr.performance-cycles.fields.sort_order",
      "default": 0,
      "tab": "general"
    }),

  field.switch("is_active", "Active", {
      "labelKey": "references.hr.performance-cycles.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})