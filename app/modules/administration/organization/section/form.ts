import { createForm, field } from "@framework"

export const sectionForm = createForm([
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

  field.lookup("division", "Division", "/api/administration/organization/lookup/divisions/", {
      "required": true,
      "dependsOn": "site",
      "lookupParams": {
        "site_id": "$site"
      },
      "tab": "general",
      "order": 30
    }),

  field.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
      "required": true,
      "dependsOn": "division",
      "lookupParams": {
        "division_id": "$division"
      },
      "tab": "general",
      "order": 40
    }),

  field.text("code", "Section Code", {
      "required": true,
      "placeholder": "e.g. MINE",
      "tab": "general",
      "order": 50
    }),

  field.text("name", "Section Name", {
      "required": true,
      "placeholder": "e.g. Mine Operation",
      "tab": "general",
      "order": 60
    }),

  field.switch("is_active", "Active", {
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})