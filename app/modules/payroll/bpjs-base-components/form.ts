import { createForm, field } from "@framework"

export const bpjsBaseComponentsForm = createForm([
  field.lookup("definition", "Base Definition", "/api/payroll/bpjs-base-definitions/lookup/", {
      "labelKey": "payroll.bpjs-base-components.fields.definition",
      "required": true,
      "displayKey": "definition_label",
      "tab": "general",
      "order": 10
    }),

  field.text("allowance_code", "Allowance Code", {
      "labelKey": "payroll.bpjs-base-components.fields.allowance_code",
      "required": true,
      "hint": "Kode komponen tunjangan, persis seperti tertulis di Allowance Component.",
      "tab": "general",
      "order": 20
    }),

  field.number("sequence", "Order", {
      "labelKey": "payroll.bpjs-base-components.fields.sequence",
      "default": 1,
      "tab": "general",
      "order": 30
    }),

  field.switch("is_active", "Active", {
      "labelKey": "payroll.bpjs-base-components.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})