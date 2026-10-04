import { createForm, field } from "@framework"

export const trainingForm = createForm([
  field.text("code", "Code", {
      "labelKey": "hr.training.fields.code",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Program Name", {
      "labelKey": "hr.training.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.lookup("training_category", "Category", "/api/administration/references/hr/lookup/training-categories/", {
      "labelKey": "hr.training.fields.training_category",
      "displayKey": "training_category_name",
      "tab": "general",
      "order": 30
    }),

  field.lookup("provider", "Provider", "/api/administration/references/hr/lookup/training-providers/", {
      "labelKey": "hr.training.fields.provider",
      "displayKey": "provider_name",
      "tab": "general",
      "order": 40
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "hr.training.fields.company",
      "displayKey": "company_name",
      "hint": "Kosongkan kalau program berlaku untuk seluruh company.",
      "tab": "general",
      "order": 50
    }),

  field.select("status", "Status", {
      "labelKey": "hr.training.fields.status",
      "required": true,
      "displayKey": "status_label",
      "default": "planned",
      "multiple": false,
      "tab": "general",
      "order": 60,
      "options": [
        {
          "label": "Planned",
          "value": "planned"
        },
        {
          "label": "Ongoing",
          "value": "ongoing"
        },
        {
          "label": "Completed",
          "value": "completed"
        },
        {
          "label": "Cancelled",
          "value": "cancelled"
        }
      ]
    }),

  field.switch("is_mandatory", "Mandatory", {
      "labelKey": "hr.training.fields.is_mandatory",
      "default": false,
      "tab": "general",
      "order": 70
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.training.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.date("start_date", "Start Date", {
      "labelKey": "hr.training.fields.start_date",
      "required": true,
      "tab": "schedule",
      "order": 110
    }),

  field.date("end_date", "End Date", {
      "labelKey": "hr.training.fields.end_date",
      "tab": "schedule",
      "order": 120
    }),

  field.number("duration_hours", "Duration (hours)", {
      "labelKey": "hr.training.fields.duration_hours",
      "tab": "schedule",
      "order": 130
    }),

  field.text("venue", "Venue", {
      "labelKey": "hr.training.fields.venue",
      "hint": "Teks bebas — pelatihan sering di hotel atau kantor vendor yang tidak ada di master lokasi kerja.",
      "default": "",
      "tab": "schedule",
      "order": 140
    }),

  field.number("quota", "Quota", {
      "labelKey": "hr.training.fields.quota",
      "hint": "Dikosongkan = tanpa batas peserta. Diisi = pendaftaran ditolak setelah kuota penuh.",
      "tab": "schedule",
      "order": 150
    }),

  field.number("cost", "Cost", {
      "labelKey": "hr.training.fields.cost",
      "tab": "cost",
      "order": 210
    }),

  field.lookup("currency", "Currency", "/api/administration/currency/lookup/currencies/", {
      "labelKey": "hr.training.fields.currency",
      "displayKey": "currency_code",
      "tab": "cost",
      "order": 220
    }),

  field.textarea("description", "Description", {
      "labelKey": "hr.training.fields.description",
      "default": "",
      "rows": 4,
      "layout": "full",
      "tab": "cost",
      "order": 230
    }),
], {
  columns: 3,
})