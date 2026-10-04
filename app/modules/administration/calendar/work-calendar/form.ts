import { createForm, field } from "@framework"

export const workCalendarForm = createForm([
  field.select("scope", "Scope", {
      "labelKey": "administration.calendar.work-calendar.fields.scope",
      "default": "COMPANY",
      "multiple": false,
      "tab": "general",
      "order": 5,
      "options": [
        {
          "value": "GLOBAL",
          "label": "All Companies"
        },
        {
          "value": "COMPANY",
          "label": "Company"
        },
        {
          "value": "LOCATION",
          "label": "Location"
        }
      ]
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "administration.calendar.work-calendar.fields.company",
      "displayKey": "company_name",
      "tab": "general",
      "order": 10
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "administration.calendar.work-calendar.fields.location",
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "location_name",
      "tab": "general",
      "order": 20
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "administration.calendar.work-calendar.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.text("code", "Code", {
      "labelKey": "administration.calendar.work-calendar.fields.code",
      "required": true,
      "tab": "general"
    }),

  field.text("name", "Name", {
      "labelKey": "administration.calendar.work-calendar.fields.name",
      "required": true,
      "tab": "general"
    }),

  field.switch("monday", "Monday", {
      "labelKey": "administration.calendar.work-calendar.fields.monday",
      "default": true,
      "tab": "general"
    }),

  field.switch("tuesday", "Tuesday", {
      "labelKey": "administration.calendar.work-calendar.fields.tuesday",
      "default": true,
      "tab": "general"
    }),

  field.switch("wednesday", "Wednesday", {
      "labelKey": "administration.calendar.work-calendar.fields.wednesday",
      "default": true,
      "tab": "general"
    }),

  field.switch("thursday", "Thursday", {
      "labelKey": "administration.calendar.work-calendar.fields.thursday",
      "default": true,
      "tab": "general"
    }),

  field.switch("friday", "Friday", {
      "labelKey": "administration.calendar.work-calendar.fields.friday",
      "default": true,
      "tab": "general"
    }),

  field.switch("saturday", "Saturday", {
      "labelKey": "administration.calendar.work-calendar.fields.saturday",
      "default": false,
      "tab": "general"
    }),

  field.switch("sunday", "Sunday", {
      "labelKey": "administration.calendar.work-calendar.fields.sunday",
      "default": false,
      "tab": "general"
    }),

  field.switch("is_default", "Is default", {
      "labelKey": "administration.calendar.work-calendar.fields.is_default",
      "default": false,
      "tab": "general"
    }),
], {
  columns: 2,
})