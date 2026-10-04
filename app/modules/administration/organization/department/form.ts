import { createForm, field } from "@framework"

export const departmentForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "administration.organization.department.fields.company",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "administration.organization.department.fields.location",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "tab": "general",
      "order": 20
    }),

  field.lookup("division", "Division", "/api/administration/organization/lookup/divisions/", {
      "labelKey": "administration.organization.department.fields.division",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "location_id": "$location"
      },
      "tab": "general",
      "order": 30
    }),

  field.text("code", "Department Code", {
      "labelKey": "administration.organization.department.fields.code",
      "required": true,
      "placeholder": "e.g. HRD",
      "tab": "general",
      "order": 40
    }),

  field.text("name", "Department Name", {
      "labelKey": "administration.organization.department.fields.name",
      "required": true,
      "placeholder": "e.g. Human Resources",
      "tab": "general",
      "order": 50
    }),

  field.switch("is_active", "Active", {
      "labelKey": "administration.organization.department.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})