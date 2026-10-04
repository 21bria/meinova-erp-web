import { createForm, field } from "@framework"

export const divisionForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "administration.organization.division.fields.company",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "administration.organization.division.fields.location",
      "required": true,
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "branch_id": "$branch"
      },
      "tab": "general",
      "order": 20
    }),

  field.text("code", "Code", {
      "labelKey": "administration.organization.division.fields.code",
      "required": true,
      "placeholder": "e.g. OPS",
      "tab": "general",
      "order": 30
    }),

  field.text("name", "Name", {
      "labelKey": "administration.organization.division.fields.name",
      "required": true,
      "placeholder": "e.g. Operations",
      "tab": "general",
      "order": 40
    }),

  field.switch("is_active", "Active", {
      "labelKey": "administration.organization.division.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})