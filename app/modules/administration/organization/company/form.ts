import { createForm, field } from "@framework"

export const companyForm = createForm([
  field.lookup("parent", "Parent Company", "/api/administration/organization/lookup/companies/", {
      "tab": "general",
      "order": 10
    }),

  field.lookup("company_type", "Company Type", "/api/administration/references/organization/lookup/company-types/", {
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.text("code", "Company Code", {
      "required": true,
      "placeholder": "e.g. MNV",
      "tab": "general",
      "order": 30
    }),

  field.text("name", "Company Name", {
      "required": true,
      "placeholder": "e.g. Meinova Indonesia",
      "tab": "general",
      "order": 40
    }),

  field.text("legal_name", "Legal Name", {
      "placeholder": "e.g. PT Meinova Indonesia",
      "tab": "general",
      "order": 50
    }),

  field.text("tax_number", "Tax Number", {
      "placeholder": "NPWP",
      "tab": "general",
      "order": 60
    }),

  field.text("phone", "Phone", {
      "tab": "general",
      "order": 70
    }),

  field.email("email", "Email", {
      "tab": "general",
      "order": 80
    }),

  field.text("website", "Website", {
      "placeholder": "https://example.com",
      "tab": "general",
      "order": 90
    }),

  field.lookup("country", "Country", "/api/administration/references/geography/lookup/countries/", {
      "tab": "general",
      "order": 100
    }),

  field.text("postal_code", "Postal code", {
      "tab": "general"
    }),

  field.lookup("province", "Province", "/api/administration/references/geography/lookup/provinces/", {
      "dependsOn": "country",
      "lookupParams": {
        "country_id": "$country"
      },
      "tab": "general",
      "order": 110
    }),

  field.lookup("city", "City", "/api/administration/references/geography/lookup/cities/", {
      "dependsOn": "province",
      "lookupParams": {
        "province_id": "$province"
      },
      "tab": "general",
      "order": 120
    }),

  field.textarea("address", "Address", {
      "rows": 4,
      "layout": "full",
      "tab": "general",
      "order": 130
    }),

  field.switch("is_active", "Active", {
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})