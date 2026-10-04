import { createForm, field } from "@framework"

export const leaveBalancesForm = createForm([
  field.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "hr.leave-balances.fields.employee",
      "required": true,
      "displayKey": "employee_name",
      "tab": "general",
      "order": 10
    }),

  field.lookup("leave_type", "Leave Type", "/api/administration/references/hr/lookup/leave-types/", {
      "labelKey": "hr.leave-balances.fields.leave_type",
      "required": true,
      "displayKey": "leave_type_name",
      "tab": "general",
      "order": 20
    }),

  field.number("year", "Year", {
      "labelKey": "hr.leave-balances.fields.year",
      "required": true,
      "tab": "general",
      "order": 30
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.leave-balances.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.date("carried_over_expires_at", "Carried Over Expires", {
      "labelKey": "hr.leave-balances.fields.carried_over_expires_at",
      "hint": "Tanggal sisa bawaan hangus. Dikosongkan = tidak hangus.",
      "tab": "general"
    }),

  field.number("carried_over_forfeited", "Carried Over Forfeited", {
      "labelKey": "hr.leave-balances.fields.carried_over_forfeited",
      "hint": "Sisa bawaan yang sudah hangus karena lewat tanggalnya.",
      "default": 0,
      "tab": "general"
    }),

  field.number("entitlement", "Entitlement", {
      "labelKey": "hr.leave-balances.fields.entitlement",
      "required": true,
      "hint": "Jatah cuti tahun berjalan, dalam hari.",
      "default": 0,
      "tab": "quota",
      "order": 110
    }),

  field.number("carried_over", "Carried Over", {
      "labelKey": "hr.leave-balances.fields.carried_over",
      "hint": "Sisa cuti tahun sebelumnya yang dibawa.",
      "default": 0,
      "tab": "quota",
      "order": 120
    }),

  field.number("opening_balance", "Opening Balance", {
      "labelKey": "hr.leave-balances.fields.opening_balance",
      "readonly": true,
      "hint": "Saldo awal saat ERP mulai dipakai. Diubah lewat dokumen Leave Opening Balance, bukan dari layar ini.",
      "default": 0,
      "tab": "quota",
      "order": 125
    }),

  field.date("opening_expires_at", "Opening Expires", {
      "labelKey": "hr.leave-balances.fields.opening_expires_at",
      "readonly": true,
      "hint": "Tanggal saldo awal hangus. Kosong = tidak hangus.",
      "tab": "quota",
      "order": 126
    }),

  field.number("adjustment", "Adjustment", {
      "labelKey": "hr.leave-balances.fields.adjustment",
      "hint": "Koreksi manual, boleh negatif. Tidak berasal dari record cuti.",
      "default": 0,
      "tab": "quota",
      "order": 130
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.leave-balances.fields.notes",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "quota",
      "order": 150
    }),
], {
  columns: 2,
})