import { createForm, field } from "@framework"

export const companyForm = createForm([
  field.lookup("parent", "Parent Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "administration.organization.company.fields.parent",
      "tab": "general",
      "order": 10
    }),

  field.lookup("company_type", "Company Type", "/api/administration/references/organization/lookup/company-types/", {
      "labelKey": "administration.organization.company.fields.company_type",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.text("code", "Company Code", {
      "labelKey": "administration.organization.company.fields.code",
      "required": true,
      "placeholder": "e.g. MNV",
      "tab": "general",
      "order": 30
    }),

  field.text("name", "Company Name", {
      "labelKey": "administration.organization.company.fields.name",
      "required": true,
      "placeholder": "e.g. Meinova Indonesia",
      "tab": "general",
      "order": 40
    }),

  field.text("legal_name", "Legal Name", {
      "labelKey": "administration.organization.company.fields.legal_name",
      "placeholder": "e.g. PT Meinova Indonesia",
      "tab": "general",
      "order": 50
    }),

  field.text("tax_number", "Tax Number", {
      "labelKey": "administration.organization.company.fields.tax_number",
      "placeholder": "NPWP",
      "tab": "general",
      "order": 60
    }),

  field.text("phone", "Phone", {
      "labelKey": "administration.organization.company.fields.phone",
      "tab": "general",
      "order": 70
    }),

  field.email("email", "Email", {
      "labelKey": "administration.organization.company.fields.email",
      "tab": "general",
      "order": 80
    }),

  field.url("website", "Website", {
      "labelKey": "administration.organization.company.fields.website",
      "placeholder": "https://example.com",
      "tab": "general",
      "order": 90
    }),

  field.lookup("country", "Country", "/api/administration/references/geography/lookup/countries/", {
      "labelKey": "administration.organization.company.fields.country",
      "tab": "general",
      "order": 100
    }),

  field.text("postal_code", "Postal code", {
      "labelKey": "administration.organization.company.fields.postal_code",
      "tab": "general"
    }),

  field.lookup("province", "Province", "/api/administration/references/geography/lookup/provinces/", {
      "labelKey": "administration.organization.company.fields.province",
      "dependsOn": "country",
      "lookupParams": {
        "country_id": "$country"
      },
      "tab": "general",
      "order": 110
    }),

  field.lookup("city", "City", "/api/administration/references/geography/lookup/cities/", {
      "labelKey": "administration.organization.company.fields.city",
      "dependsOn": "province",
      "lookupParams": {
        "province_id": "$province"
      },
      "tab": "general",
      "order": 120
    }),

  field.textarea("address", "Address", {
      "labelKey": "administration.organization.company.fields.address",
      "rows": 4,
      "layout": "full",
      "tab": "general",
      "order": 130
    }),

  field.switch("is_active", "Active", {
      "labelKey": "administration.organization.company.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})