import { createForm, field } from "@framework"

export const branchForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "administration.organization.branch.fields.company",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("code", "Branch Code", {
      "labelKey": "administration.organization.branch.fields.code",
      "required": true,
      "placeholder": "e.g. JKT",
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Branch Name", {
      "labelKey": "administration.organization.branch.fields.name",
      "required": true,
      "placeholder": "e.g. Jakarta Branch",
      "tab": "general",
      "order": 30
    }),

  field.url("website", "Website", {
      "labelKey": "administration.organization.branch.fields.website",
      "placeholder": "https://example.com",
      "tab": "general",
      "order": 40
    }),

  field.lookup("country", "Country", "/api/administration/references/geography/lookup/countries/", {
      "labelKey": "administration.organization.branch.fields.country",
      "required": true,
      "tab": "general",
      "order": 50
    }),

  field.lookup("province", "Province", "/api/administration/references/geography/lookup/provinces/", {
      "labelKey": "administration.organization.branch.fields.province",
      "dependsOn": "country",
      "lookupParams": {
        "country_id": "$country"
      },
      "tab": "general",
      "order": 60
    }),

  field.lookup("city", "City", "/api/administration/references/geography/lookup/cities/", {
      "labelKey": "administration.organization.branch.fields.city",
      "dependsOn": "province",
      "lookupParams": {
        "province_id": "$province"
      },
      "tab": "general",
      "order": 70
    }),

  field.textarea("address", "Address", {
      "labelKey": "administration.organization.branch.fields.address",
      "layout": "full",
      "tab": "general"
    }),

  field.text("postal_code", "Postal code", {
      "labelKey": "administration.organization.branch.fields.postal_code",
      "tab": "general"
    }),

  field.text("phone", "Phone", {
      "labelKey": "administration.organization.branch.fields.phone",
      "tab": "general"
    }),

  field.email("email", "Email", {
      "labelKey": "administration.organization.branch.fields.email",
      "tab": "general"
    }),

  field.switch("is_active", "Active", {
      "labelKey": "administration.organization.branch.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})