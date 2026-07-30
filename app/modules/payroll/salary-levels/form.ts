import { createForm, field } from "@framework"

export const salaryLevelsForm = createForm([
  field.lookup("salary_grade", "Salary Grade", "/api/payroll/salary-grades/lookup/", {
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("code", "Level Code", {
      "required": true,
      "placeholder": "e.g. A1",
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Level Name", {
      "required": true,
      "placeholder": "e.g. Junior Level",
      "tab": "general",
      "order": 30
    }),

  field.text("sequence", "Sequence", {
      "placeholder": "e.g. 1",
      "tab": "general",
      "order": 40
    }),

  field.text("minimum_salary", "Minimum Salary", {
      "placeholder": "e.g. 5000000",
      "tab": "general",
      "order": 50
    }),

  field.text("maximum_salary", "Maximum Salary", {
      "placeholder": "e.g. 7500000",
      "tab": "general",
      "order": 60
    }),

  field.textarea("description", "Description", {
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 70
    }),

  field.switch("is_active", "Active", {
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})