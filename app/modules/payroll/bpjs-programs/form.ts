import { createForm, field } from "@framework"

export const bpjsProgramsForm = createForm([
  field.text("code", "Code", {
      "labelKey": "payroll.bpjs-programs.fields.code",
      "required": true,
      "hint": "Mis. JKN, JHT, JP, JKK, JKM.",
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "payroll.bpjs-programs.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.number("sequence", "Order", {
      "labelKey": "payroll.bpjs-programs.fields.sequence",
      "default": 1,
      "tab": "general",
      "order": 30
    }),

  field.switch("uses_risk_class", "Uses Risk Class", {
      "labelKey": "payroll.bpjs-programs.fields.uses_risk_class",
      "hint": "Tarif program ini ditentukan kelas risiko kerja. Kepesertaan dan aturannya wajib menyebut kelasnya.",
      "default": false,
      "tab": "general",
      "order": 35
    }),

  field.textarea("description", "Description", {
      "labelKey": "payroll.bpjs-programs.fields.description",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 40
    }),

  field.switch("is_active", "Active", {
      "labelKey": "payroll.bpjs-programs.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})