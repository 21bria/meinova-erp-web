import { createForm, field } from "@framework"

export const salaryGradesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "payroll.salary-grades.fields.code",
      "required": true,
      "tab": "general"
    }),

  field.text("name", "Name", {
      "labelKey": "payroll.salary-grades.fields.name",
      "required": true,
      "tab": "general"
    }),

  field.textarea("description", "Description", {
      "labelKey": "payroll.salary-grades.fields.description",
      "layout": "full",
      "tab": "general"
    }),

  field.number("minimum_salary", "Minimum salary", {
      "labelKey": "payroll.salary-grades.fields.minimum_salary",
      "tab": "general"
    }),

  field.number("maximum_salary", "Maximum salary", {
      "labelKey": "payroll.salary-grades.fields.maximum_salary",
      "tab": "general"
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "payroll.salary-grades.fields.is_active",
      "default": true,
      "tab": "general"
    }),
], {
  columns: 2,
})