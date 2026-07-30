import { createForm, field } from "@framework"

export const siteForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
      "required": true,
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "tab": "general",
      "order": 20
    }),

  field.lookup("site_type", "Site Type", "/api/administration/references/organization/lookup/site-types/", {
      "required": true,
      "tab": "general",
      "order": 30
    }),

  field.text("code", "Site Code", {
      "required": true,
      "placeholder": "e.g. SITE-01",
      "tab": "general",
      "order": 40
    }),

  field.text("name", "Site Name", {
      "required": true,
      "placeholder": "e.g. Site Morowali",
      "tab": "general",
      "order": 50
    }),

  field.textarea("address", "Address", {
      "layout": "full",
      "tab": "general"
    }),

  field.text("postal_code", "Postal code", {
      "tab": "general"
    }),

  field.switch("is_active", "Active", {
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})