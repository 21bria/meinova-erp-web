import { createForm, field } from "@framework"

export const tenantSettingsForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "administration.settings.tenant-settings.fields.company",
      "required": true,
      "displayKey": "company_name",
      "tab": "general",
      "order": 10
    }),

  field.lookup("currency", "Currency", "/api/administration/currency/lookup/currencies/", {
      "labelKey": "administration.settings.tenant-settings.fields.currency",
      "displayKey": "currency_name",
      "tab": "general",
      "order": 20
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "administration.settings.tenant-settings.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.text("timezone", "Timezone", {
      "labelKey": "administration.settings.tenant-settings.fields.timezone",
      "default": "Asia/Jakarta",
      "tab": "general"
    }),

  field.text("language", "Language", {
      "labelKey": "administration.settings.tenant-settings.fields.language",
      "default": "id",
      "tab": "general"
    }),

  field.text("date_format", "Date format", {
      "labelKey": "administration.settings.tenant-settings.fields.date_format",
      "default": "DD/MM/YYYY",
      "tab": "general"
    }),

  field.text("decimal_separator", "Decimal separator", {
      "labelKey": "administration.settings.tenant-settings.fields.decimal_separator",
      "default": ",",
      "tab": "general"
    }),

  field.text("thousand_separator", "Thousand separator", {
      "labelKey": "administration.settings.tenant-settings.fields.thousand_separator",
      "default": ".",
      "tab": "general"
    }),
], {
  columns: 2,
})