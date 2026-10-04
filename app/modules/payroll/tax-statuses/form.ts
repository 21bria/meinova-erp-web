import { createForm, field } from "@framework"

export const taxStatusesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "payroll.tax-statuses.fields.code",
      "required": true,
      "tab": "general"
    }),

  field.text("name", "Name", {
      "labelKey": "payroll.tax-statuses.fields.name",
      "required": true,
      "tab": "general"
    }),

  field.textarea("description", "Description", {
      "labelKey": "payroll.tax-statuses.fields.description",
      "layout": "full",
      "tab": "general"
    }),

  field.number("non_taxable_income", "Non taxable income", {
      "labelKey": "payroll.tax-statuses.fields.non_taxable_income",
      "default": 0,
      "tab": "general"
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "payroll.tax-statuses.fields.is_active",
      "default": true,
      "tab": "general"
    }),
], {
  columns: 2,
})