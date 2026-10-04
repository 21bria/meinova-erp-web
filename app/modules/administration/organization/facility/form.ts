import { createForm, field } from "@framework"

export const facilityForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "administration.organization.facility.fields.company",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
      "labelKey": "administration.organization.facility.fields.branch",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "tab": "general",
      "order": 20
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "administration.organization.facility.fields.location",
      "required": true,
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company",
        "branch_id": "$branch"
      },
      "tab": "general",
      "order": 30
    }),

  field.lookup("facility_type", "Facility Type", "/api/administration/references/organization/lookup/facility-types/", {
      "labelKey": "administration.organization.facility.fields.facility_type",
      "required": true,
      "tab": "general",
      "order": 40
    }),

  field.text("code", "Facility Code", {
      "labelKey": "administration.organization.facility.fields.code",
      "required": true,
      "placeholder": "e.g. WS-01",
      "tab": "general",
      "order": 50
    }),

  field.text("name", "Facility Name", {
      "labelKey": "administration.organization.facility.fields.name",
      "required": true,
      "placeholder": "e.g. Workshop Gebe",
      "tab": "general",
      "order": 60
    }),

  field.textarea("description", "Description", {
      "labelKey": "administration.organization.facility.fields.description",
      "default": "",
      "layout": "full",
      "tab": "general",
      "order": 70
    }),

  field.switch("is_active", "Active", {
      "labelKey": "administration.organization.facility.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})