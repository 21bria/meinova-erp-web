import { createForm, field } from "@framework"

export const costCenterForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "administration.organization.cost-center.fields.company",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "administration.organization.cost-center.fields.location",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "tab": "general",
      "order": 20
    }),

  field.text("code", "Cost Center Code", {
      "labelKey": "administration.organization.cost-center.fields.code",
      "required": true,
      "placeholder": "e.g. CC-001",
      "tab": "general",
      "order": 30
    }),

  field.text("name", "Cost Center Name", {
      "labelKey": "administration.organization.cost-center.fields.name",
      "required": true,
      "placeholder": "e.g. Mining Operation",
      "tab": "general",
      "order": 40
    }),

  field.switch("is_active", "Active", {
      "labelKey": "administration.organization.cost-center.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})