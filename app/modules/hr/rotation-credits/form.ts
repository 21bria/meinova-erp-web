import { createForm, field } from "@framework"

export const rotationCreditsForm = createForm([
  field.text("employee_number", "Employee No.", {
      "labelKey": "hr.rotation-credits.fields.employee_number",
      "readonly": true,
      "tab": "general",
      "order": 5
    }),

  field.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "hr.rotation-credits.fields.employee",
      "required": true,
      "displayKey": "employee_name",
      "tab": "general",
      "order": 10
    }),

  field.select("entry_type", "Entry Type", {
      "labelKey": "hr.rotation-credits.fields.entry_type",
      "required": true,
      "displayKey": "entry_type_label",
      "multiple": false,
      "tab": "general",
      "order": 20,
      "options": [
        {
          "label": "Opening Balance",
          "value": "opening_balance"
        },
        {
          "label": "Earned",
          "value": "earned"
        },
        {
          "label": "Used",
          "value": "used"
        },
        {
          "label": "Adjustment (+)",
          "value": "adjustment_plus"
        },
        {
          "label": "Adjustment (−)",
          "value": "adjustment_minus"
        },
        {
          "label": "Expired",
          "value": "expired"
        },
        {
          "label": "Reversal",
          "value": "reversal"
        }
      ]
    }),

  field.number("days", "Days", {
      "labelKey": "hr.rotation-credits.fields.days",
      "required": true,
      "hint": "Selalu positif. Arahnya ditentukan Entry Type — pengurangan tidak pernah ditulis sebagai angka negatif.",
      "tab": "general",
      "order": 30
    }),

  field.number("signed_days", "Effect", {
      "labelKey": "hr.rotation-credits.fields.signed_days",
      "readonly": true,
      "hint": "Kontribusi baris ini ke saldo. Pembalikan mengambil arah berlawanan dari yang dibatalkannya.",
      "tab": "general",
      "order": 35
    }),

  field.date("effective_date", "Effective Date", {
      "labelKey": "hr.rotation-credits.fields.effective_date",
      "required": true,
      "hint": "Boleh mundur — saldo awal dari sistem lama berlaku sejak tanggal go-live, bukan sejak diketik.",
      "tab": "general",
      "order": 40
    }),

  field.date("transaction_date", "Recorded On", {
      "labelKey": "hr.rotation-credits.fields.transaction_date",
      "readonly": true,
      "hint": "Kapan transaksi ini dicatat.",
      "tab": "general",
      "order": 45
    }),

  field.textarea("reason", "Reason", {
      "labelKey": "hr.rotation-credits.fields.reason",
      "hint": "Wajib untuk penyesuaian, kedaluwarsa, dan pembalikan — saldo yang berubah tanpa alasan tidak bisa dijelaskan ke pegawainya.",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 50
    }),

  field.text("source_label", "Source", {
      "labelKey": "hr.rotation-credits.fields.source_label",
      "readonly": true,
      "tab": "general",
      "order": 55
    }),

  field.number("conversion_ratio", "Ratio", {
      "labelKey": "hr.rotation-credits.fields.conversion_ratio",
      "readonly": true,
      "tab": "general",
      "order": 60
    }),

  field.number("remainder_days", "Carried", {
      "labelKey": "hr.rotation-credits.fields.remainder_days",
      "readonly": true,
      "hint": "Hari kerja yang belum genap jadi satu kredit, dibawa ke konversi berikutnya.",
      "default": 0,
      "tab": "general",
      "order": 65
    }),

  field.text("reversed_by_label", "Reversed By", {
      "labelKey": "hr.rotation-credits.fields.reversed_by_label",
      "readonly": true,
      "tab": "general",
      "order": 70
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.rotation-credits.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.text("source_type", "Source type", {
      "labelKey": "hr.rotation-credits.fields.source_type",
      "default": "",
      "tab": "general"
    }),

  field.text("source_id", "Source id", {
      "labelKey": "hr.rotation-credits.fields.source_id",
      "default": "",
      "tab": "general"
    }),
], {
  columns: 2,
})