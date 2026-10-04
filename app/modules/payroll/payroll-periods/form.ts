import { createForm, field } from "@framework"

export const payrollPeriodsForm = createForm([
  field.text("code", "Period Code", {
      "labelKey": "payroll.payroll-periods.fields.code",
      "required": true,
      "placeholder": "e.g. 2026-09",
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Period Name", {
      "labelKey": "payroll.payroll-periods.fields.name",
      "required": true,
      "placeholder": "e.g. September 2026",
      "tab": "general",
      "order": 20
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "payroll.payroll-periods.fields.company",
      "required": true,
      "displayKey": "company_name",
      "tab": "general",
      "order": 30
    }),

  field.lookup("payroll_group", "Payroll Group", "/api/payroll/payroll-groups/lookup/", {
      "labelKey": "payroll.payroll-periods.fields.payroll_group",
      "required": true,
      "displayKey": "payroll_group_name",
      "tab": "general",
      "order": 40
    }),

  field.date("start_date", "Start Date", {
      "labelKey": "payroll.payroll-periods.fields.start_date",
      "required": true,
      "tab": "general",
      "order": 50
    }),

  field.date("end_date", "End Date", {
      "labelKey": "payroll.payroll-periods.fields.end_date",
      "required": true,
      "tab": "general",
      "order": 60
    }),

  field.date("cutoff_date", "Cutoff Date", {
      "labelKey": "payroll.payroll-periods.fields.cutoff_date",
      "hint": "Batas terakhir absensi, lembur, dan input diambil. Kosong = sama dengan End Date.",
      "tab": "general",
      "order": 70
    }),

  field.date("payment_date", "Payment Date", {
      "labelKey": "payroll.payroll-periods.fields.payment_date",
      "tab": "general",
      "order": 80
    }),

  field.number("working_days", "Working Days (Divisor)", {
      "labelKey": "payroll.payroll-periods.fields.working_days",
      "hint": "Pembagi prorata dan potongan harian. Kosong = jumlah hari kalender periode.",
      "tab": "general",
      "order": 90
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "payroll.payroll-periods.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "payroll.payroll-periods.fields.notes",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 110
    }),
], {
  columns: 3,
})