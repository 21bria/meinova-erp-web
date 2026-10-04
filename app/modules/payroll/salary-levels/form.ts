import { createForm, field } from "@framework"

export const salaryLevelsForm = createForm([
  field.lookup("salary_grade", "Salary Grade", "/api/payroll/salary-grades/lookup/", {
      "labelKey": "payroll.salary-levels.fields.salary_grade",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("code", "Level Code", {
      "labelKey": "payroll.salary-levels.fields.code",
      "required": true,
      "placeholder": "e.g. A1",
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Level Name", {
      "labelKey": "payroll.salary-levels.fields.name",
      "required": true,
      "placeholder": "e.g. Junior Level",
      "tab": "general",
      "order": 30
    }),

  field.number("sequence", "Sequence", {
      "labelKey": "payroll.salary-levels.fields.sequence",
      "placeholder": "e.g. 1",
      "default": 1,
      "tab": "general",
      "order": 40
    }),

  field.number("minimum_salary", "Minimum Salary", {
      "labelKey": "payroll.salary-levels.fields.minimum_salary",
      "placeholder": "e.g. 5000000",
      "tab": "general",
      "order": 50
    }),

  field.number("maximum_salary", "Maximum Salary", {
      "labelKey": "payroll.salary-levels.fields.maximum_salary",
      "placeholder": "e.g. 7500000",
      "tab": "general",
      "order": 60
    }),

  field.textarea("description", "Description", {
      "labelKey": "payroll.salary-levels.fields.description",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 70
    }),

  field.switch("is_active", "Active", {
      "labelKey": "payroll.salary-levels.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})