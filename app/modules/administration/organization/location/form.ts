import { createForm, field } from "@framework"

export const locationForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "administration.organization.location.fields.company",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
      "labelKey": "administration.organization.location.fields.branch",
      "required": true,
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "tab": "general",
      "order": 20
    }),

  field.lookup("location_type", "Location Type", "/api/administration/references/organization/lookup/location-types/", {
      "labelKey": "administration.organization.location.fields.location_type",
      "required": true,
      "tab": "general",
      "order": 30
    }),

  field.text("code", "Location Code", {
      "labelKey": "administration.organization.location.fields.code",
      "required": true,
      "placeholder": "e.g. LOCATION-01",
      "tab": "general",
      "order": 40
    }),

  field.text("name", "Location Name", {
      "labelKey": "administration.organization.location.fields.name",
      "required": true,
      "placeholder": "e.g. Location Morowali",
      "tab": "general",
      "order": 50
    }),

  field.textarea("address", "Address", {
      "labelKey": "administration.organization.location.fields.address",
      "layout": "full",
      "tab": "general"
    }),

  field.text("postal_code", "Postal code", {
      "labelKey": "administration.organization.location.fields.postal_code",
      "tab": "general"
    }),

  field.switch("is_active", "Active", {
      "labelKey": "administration.organization.location.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})