import { createForm, field } from "@framework"

export const visitPurposesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "references.hr.visit-purposes.fields.code",
      "required": true,
      "placeholder": "e.g. CODE",
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "references.hr.visit-purposes.fields.name",
      "required": true,
      "placeholder": "Name",
      "tab": "general",
      "order": 20
    }),

  field.textarea("description", "Description", {
      "labelKey": "references.hr.visit-purposes.fields.description",
      "default": "",
      "rows": 4,
      "layout": "full",
      "tab": "general",
      "order": 30
    }),

  field.switch("requires_approval", "Requires Approval", {
      "labelKey": "references.hr.visit-purposes.fields.requires_approval",
      "hint": "Belum berpengaruh — seluruh Visitor Request tetap melewati alur persetujuan.",
      "default": true,
      "tab": "general",
      "order": 40
    }),

  field.number("sort_order", "Sort order", {
      "labelKey": "references.hr.visit-purposes.fields.sort_order",
      "default": 0,
      "tab": "general"
    }),

  field.switch("is_active", "Active", {
      "labelKey": "references.hr.visit-purposes.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})