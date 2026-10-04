import { createForm, field } from "@framework"

export const payrollGroupsForm = createForm([
  field.text("code", "Code", {
      "labelKey": "payroll.payroll-groups.fields.code",
      "required": true,
      "tab": "general"
    }),

  field.text("name", "Name", {
      "labelKey": "payroll.payroll-groups.fields.name",
      "required": true,
      "tab": "general"
    }),

  field.textarea("description", "Description", {
      "labelKey": "payroll.payroll-groups.fields.description",
      "layout": "full",
      "tab": "general"
    }),

  field.text("pay_frequency", "Pay frequency", {
      "labelKey": "payroll.payroll-groups.fields.pay_frequency",
      "default": "monthly",
      "tab": "general"
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "payroll.payroll-groups.fields.is_active",
      "default": true,
      "tab": "general"
    }),
], {
  columns: 2,
})