import { createForm, field } from "@framework"

export const departmentForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.lookup("site", "Site", "/api/administration/organization/lookup/sites/", {
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "tab": "general",
      "order": 20
    }),

  field.lookup("division", "Division", "/api/administration/organization/lookup/divisions/", {
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "tab": "general",
      "order": 30
    }),

  field.text("code", "Department Code", {
      "required": true,
      "placeholder": "e.g. HRD",
      "tab": "general",
      "order": 40
    }),

  field.text("name", "Department Name", {
      "required": true,
      "placeholder": "e.g. Human Resources",
      "tab": "general",
      "order": 50
    }),

  field.switch("is_active", "Active", {
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})