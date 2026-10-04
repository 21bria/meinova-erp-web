import { createForm, field } from "@framework"

export const accountingPeriodsForm = createForm([
  field.lookup("fiscal_year", "Fiscal Year", "/api/finance/lookup/fiscal-years/", {
      "labelKey": "finance.accounting-periods.fields.fiscal_year",
      "required": true,
      "displayKey": "fiscal_year_name",
      "tab": "general",
      "order": 10
    }),

  field.number("period_number", "No.", {
      "labelKey": "finance.accounting-periods.fields.period_number",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.text("code", "Code", {
      "labelKey": "finance.accounting-periods.fields.code",
      "required": true,
      "tab": "general",
      "order": 30
    }),

  field.text("name", "Name", {
      "labelKey": "finance.accounting-periods.fields.name",
      "required": true,
      "tab": "general",
      "order": 40
    }),

  field.date("start_date", "Start Date", {
      "labelKey": "finance.accounting-periods.fields.start_date",
      "required": true,
      "tab": "general",
      "order": 50
    }),

  field.date("end_date", "End Date", {
      "labelKey": "finance.accounting-periods.fields.end_date",
      "required": true,
      "tab": "general",
      "order": 60
    }),

  field.select("status", "Status", {
      "labelKey": "finance.accounting-periods.fields.status",
      "disabled": true,
      "displayKey": "status_label",
      "hint": "Diubah lewat tombol Open / Soft Close / Close / Lock, bukan dari sini — supaya jejaknya tercatat.",
      "default": "open",
      "multiple": false,
      "tab": "general",
      "order": 70,
      "options": [
        {
          "label": "Open",
          "value": "open"
        },
        {
          "label": "Soft Closed",
          "value": "soft_closed"
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

  field.switch("is_active", "Is active", {
      "labelKey": "finance.accounting-periods.fields.is_active",
      "default": true,
      "tab": "general"
    }),
], {
  columns: 2,
})