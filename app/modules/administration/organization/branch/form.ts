import { createForm, field } from "@framework"

export const branchForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("code", "Branch Code", {
      "required": true,
      "placeholder": "e.g. JKT",
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Branch Name", {
      "required": true,
      "placeholder": "e.g. Jakarta Branch",
      "tab": "general",
      "order": 30
    }),

  field.text("website", "Website", {
      "placeholder": "https://example.com",
      "tab": "general",
      "order": 40
    }),

  field.lookup("country", "Country", "/api/administration/references/geography/lookup/countries/", {
      "required": true,
      "tab": "general",
      "order": 50
    }),

  field.lookup("province", "Province", "/api/administration/references/geography/lookup/provinces/", {
      "dependsOn": "country",
      "lookupParams": {
        "country_id": "$country"
      },
      "tab": "general",
      "order": 60
    }),

  field.lookup("city", "City", "/api/administration/references/geography/lookup/cities/", {
      "dependsOn": "province",
      "lookupParams": {
        "province_id": "$province"
      },
      "tab": "general",
      "order": 70
    }),

  field.textarea("address", "Address", {
      "layout": "full",
      "tab": "general"
    }),

  field.text("postal_code", "Postal code", {
      "tab": "general"
    }),

  field.text("phone", "Phone", {
      "tab": "general"
    }),

  field.email("email", "Email", {
      "tab": "general"
    }),

  field.switch("is_active", "Active", {
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})