import { createForm, field } from "@framework"

export const bpjsRiskClassesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "payroll.bpjs-risk-classes.fields.code",
      "required": true,
      "hint": "Kode kelas risiko menurut konfigurasi yang berlaku.",
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "payroll.bpjs-risk-classes.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.number("sequence", "Order", {
      "labelKey": "payroll.bpjs-risk-classes.fields.sequence",
      "default": 1,
      "tab": "general",
      "order": 30
    }),

  field.textarea("description", "Description", {
      "labelKey": "payroll.bpjs-risk-classes.fields.description",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 40
    }),

  field.switch("is_active", "Active", {
      "labelKey": "payroll.bpjs-risk-classes.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})