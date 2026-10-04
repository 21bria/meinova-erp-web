import { createForm, field } from "@framework"

export const sectionForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "administration.organization.section.fields.company",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "administration.organization.section.fields.location",
      "required": true,
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "tab": "general",
      "order": 20
    }),

  field.lookup("division", "Division", "/api/administration/organization/lookup/divisions/", {
      "labelKey": "administration.organization.section.fields.division",
      "required": true,
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "location_id": "$location"
      },
      "tab": "general",
      "order": 30
    }),

  field.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
      "labelKey": "administration.organization.section.fields.department",
      "required": true,
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "location_id": "$location",
        "division_id": "$division"
      },
      "tab": "general",
      "order": 40
    }),

  field.text("code", "Section Code", {
      "labelKey": "administration.organization.section.fields.code",
      "required": true,
      "placeholder": "e.g. MINE",
      "tab": "general",
      "order": 50
    }),

  field.text("name", "Section Name", {
      "labelKey": "administration.organization.section.fields.name",
      "required": true,
      "placeholder": "e.g. Mine Operation",
      "tab": "general",
      "order": 60
    }),

  field.switch("is_active", "Active", {
      "labelKey": "administration.organization.section.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})