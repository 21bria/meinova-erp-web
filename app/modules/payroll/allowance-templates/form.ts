import { createForm, field } from "@framework"

export const allowanceTemplatesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "payroll.allowance-templates.fields.code",
      "required": true,
      "tab": "general"
    }),

  field.text("name", "Name", {
      "labelKey": "payroll.allowance-templates.fields.name",
      "required": true,
      "tab": "general"
    }),

  field.textarea("description", "Description", {
      "labelKey": "payroll.allowance-templates.fields.description",
      "layout": "full",
      "tab": "general"
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "payroll.allowance-templates.fields.is_active",
      "default": true,
      "tab": "general"
    }),
], {
  columns: 2,
})