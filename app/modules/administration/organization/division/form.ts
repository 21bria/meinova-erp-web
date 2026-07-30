import { createForm, field } from "@framework"

export const divisionForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.lookup("site", "Site", "/api/administration/organization/lookup/sites/", {
      "required": true,
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "tab": "general",
      "order": 20
    }),

  field.text("code", "Code", {
      "required": true,
      "placeholder": "e.g. OPS",
      "tab": "general",
      "order": 30
    }),

  field.text("name", "Name", {
      "required": true,
      "placeholder": "e.g. Operations",
      "tab": "general",
      "order": 40
    }),

  field.switch("is_active", "Active", {
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})