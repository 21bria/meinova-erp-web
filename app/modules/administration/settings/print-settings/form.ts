import { createForm, field } from "@framework"

export const printSettingsForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "administration.settings.print-settings.fields.company",
      "required": true,
      "displayKey": "company_name",
      "tab": "general",
      "order": 10
    }),

  field.select("default_paper_size", "Default paper size", {
      "labelKey": "administration.settings.print-settings.fields.default_paper_size",
      "default": "A4",
      "multiple": false,
      "tab": "general",
      "order": 20,
      "options": [
        {
          "label": "A4",
          "value": "A4"
        },
        {
          "label": "A5",
          "value": "A5"
        },
        {
          "label": "Letter",
          "value": "LETTER"
        },
        {
          "label": "Legal",
          "value": "LEGAL"
        }
      ]
    }),

  field.select("default_orientation", "Default orientation", {
      "labelKey": "administration.settings.print-settings.fields.default_orientation",
      "default": "PORTRAIT",
      "multiple": false,
      "tab": "general",
      "order": 30,
      "options": [
        {
          "label": "Portrait",
          "value": "PORTRAIT"
        },
        {
          "label": "Landscape",
          "value": "LANDSCAPE"
        }
      ]
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "administration.settings.print-settings.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.text("logo", "Logo", {
      "labelKey": "administration.settings.print-settings.fields.logo",
      "tab": "general"
    }),

  field.textarea("header_text", "Header text", {
      "labelKey": "administration.settings.print-settings.fields.header_text",
      "layout": "full",
      "tab": "general"
    }),

  field.textarea("footer_text", "Footer text", {
      "labelKey": "administration.settings.print-settings.fields.footer_text",
      "layout": "full",
      "tab": "general"
    }),

  field.switch("show_logo", "Show logo", {
      "labelKey": "administration.settings.print-settings.fields.show_logo",
      "default": true,
      "tab": "general"
    }),

  field.switch("show_footer", "Show footer", {
      "labelKey": "administration.settings.print-settings.fields.show_footer",
      "default": true,
      "tab": "general"
    }),
], {
  columns: 2,
})