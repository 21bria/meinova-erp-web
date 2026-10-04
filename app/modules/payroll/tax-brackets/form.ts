import { createForm, field } from "@framework"

export const taxBracketsForm = createForm([
  field.number("sequence", "Sequence", {
      "labelKey": "payroll.tax-brackets.fields.sequence",
      "required": true,
      "default": 1,
      "tab": "general",
      "order": 10
    }),

  field.number("income_from", "Annual Income From", {
      "labelKey": "payroll.tax-brackets.fields.income_from",
      "required": true,
      "hint": "Batas bawah penghasilan kena pajak setahun.",
      "default": 0,
      "tab": "general",
      "order": 20
    }),

  field.number("income_to", "Annual Income To", {
      "labelKey": "payroll.tax-brackets.fields.income_to",
      "hint": "Kosong = lapisan teratas, tanpa batas.",
      "tab": "general",
      "order": 30
    }),

  field.number("rate", "Rate (%)", {
      "labelKey": "payroll.tax-brackets.fields.rate",
      "required": true,
      "hint": "Tarif dalam persen, mis. 5 untuk 5%.",
      "default": 0,
      "tab": "general",
      "order": 40
    }),

  field.textarea("description", "Description", {
      "labelKey": "payroll.tax-brackets.fields.description",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 50
    }),

  field.switch("is_active", "Active", {
      "labelKey": "payroll.tax-brackets.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})