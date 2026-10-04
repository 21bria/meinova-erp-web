import { createForm, field } from "@framework"

export const holidayForm = createForm([
  field.select("scope", "Scope", {
      "labelKey": "administration.calendar.holiday.fields.scope",
      "default": "COMPANY",
      "multiple": false,
      "tab": "general",
      "order": 5,
      "options": [
        {
          "value": "GLOBAL",
          "label": "National / All Companies"
        },
        {
          "value": "COMPANY",
          "label": "Company"
        },
        {
          "value": "LOCATION",
          "label": "Location"
        },
        {
          "value": "SELECTED_COMPANIES",
          "label": "Selected Companies"
        }
      ]
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "administration.calendar.holiday.fields.company",
      "displayKey": "company_name",
      "tab": "general",
      "order": 10
    }),

  field.lookup("company_ids", "Companies", "/api/administration/organization/lookup/companies/", {
      "labelKey": "administration.calendar.holiday.fields.company_ids",
      "dependsOn": "scope",
      "hint": "Hanya untuk scope Selected Companies. Untuk seluruh perusahaan, pilih scope All Companies — jangan mendaftarkan semuanya satu per satu.",
      "multiple": true,
      "tab": "general",
      "order": 15
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "administration.calendar.holiday.fields.location",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "location_name",
      "tab": "general",
      "order": 20
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "administration.calendar.holiday.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.date("date", "Date", {
      "labelKey": "administration.calendar.holiday.fields.date",
      "required": true,
      "tab": "general"
    }),

  field.text("code", "Code", {
      "labelKey": "administration.calendar.holiday.fields.code",
      "required": true,
      "tab": "general"
    }),

  field.text("name", "Name", {
      "labelKey": "administration.calendar.holiday.fields.name",
      "required": true,
      "tab": "general"
    }),

  field.text("country_code", "Country code", {
      "labelKey": "administration.calendar.holiday.fields.country_code",
      "default": "",
      "tab": "general"
    }),

  field.switch("is_national", "Is national", {
      "labelKey": "administration.calendar.holiday.fields.is_national",
      "default": false,
      "tab": "general"
    }),

  field.switch("is_recurring", "Is recurring", {
      "labelKey": "administration.calendar.holiday.fields.is_recurring",
      "default": false,
      "tab": "general"
    }),

  field.select("source", "Source", {
      "labelKey": "administration.calendar.holiday.fields.source",
      "default": "MANUAL",
      "multiple": false,
      "tab": "general",
      "options": [
        {
          "value": "MANUAL",
          "label": "Manual"
        },
        {
          "value": "IMPORT",
          "label": "Import"
        },
        {
          "value": "GOOGLE",
          "label": "Google Calendar"
        },
        {
          "value": "GOVERNMENT",
          "label": "Government"
        },
        {
          "value": "ICS",
          "label": "ICS Feed"
        }
      ]
    }),
], {
  columns: 2,
})