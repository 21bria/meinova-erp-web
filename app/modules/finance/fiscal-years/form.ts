import { createForm, field } from "@framework"

export const fiscalYearsForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "finance.fiscal-years.fields.company",
      "required": true,
      "displayKey": "company_name",
      "default": "$me.placement.company",
      "tab": "general",
      "order": 10
    }),

  field.text("code", "Code", {
      "labelKey": "finance.fiscal-years.fields.code",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Name", {
      "labelKey": "finance.fiscal-years.fields.name",
      "required": true,
      "tab": "general",
      "order": 30
    }),

  field.date("start_date", "Start Date", {
      "labelKey": "finance.fiscal-years.fields.start_date",
      "required": true,
      "hint": "Tidak harus 1 Januari. Tahun buku 1 April – 31 Maret berjalan sama saja.",
      "tab": "general",
      "order": 40
    }),

  field.date("end_date", "End Date", {
      "labelKey": "finance.fiscal-years.fields.end_date",
      "required": true,
      "tab": "general",
      "order": 50
    }),

  field.select("status", "Status", {
      "labelKey": "finance.fiscal-years.fields.status",
      "displayKey": "status_label",
      "default": "open",
      "multiple": false,
      "tab": "general",
      "order": 60,
      "options": [
        {
          "label": "Open",
          "value": "open"
        },
        {
          "label": "Closed",
          "value": "closed"
        },
        {
          "label": "Locked",
          "value": "locked"
        }
      ]
    }),

  field.switch("is_current", "Current Fiscal Year", {
      "labelKey": "finance.fiscal-years.fields.is_current",
      "hint": "Penanda tampilan, bukan penjagaan. Yang menentukan sebuah jurnal boleh diposting adalah status periodenya.",
      "default": false,
      "tab": "general",
      "order": 70
    }),

  field.switch("is_active", "Active", {
      "labelKey": "finance.fiscal-years.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 80
    }),
], {
  columns: 2,
})