import { createForm, field } from "@framework"

export const leaveOpeningBalancesForm = createForm([
  field.select("status", "Status", {
      "labelKey": "hr.leave-opening-balances.fields.status",
      "readonly": true,
      "displayKey": "status_label",
      "hint": "Draft belum memengaruhi kartu saldo. Tekan Post kalau angkanya sudah benar.",
      "default": "draft",
      "multiple": false,
      "tab": "general",
      "order": 1,
      "options": [
        {
          "label": "Draft",
          "value": "draft"
        },
        {
          "label": "Posted",
          "value": "posted"
        }
      ]
    }),

  field.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "hr.leave-opening-balances.fields.employee",
      "required": true,
      "displayKey": "employee_name",
      "tab": "general",
      "order": 10
    }),

  field.lookup("leave_type", "Leave Type", "/api/administration/references/hr/lookup/leave-types/", {
      "labelKey": "hr.leave-opening-balances.fields.leave_type",
      "required": true,
      "displayKey": "leave_type_name",
      "tab": "general",
      "order": 20
    }),

  field.date("opening_date", "Opening Date", {
      "labelKey": "hr.leave-opening-balances.fields.opening_date",
      "hint": "Tanggal saldo ini berlaku. Dikosongkan = ikut tanggal Leave Go-Live perusahaan pegawainya. Bukan tanggal pengetikan.",
      "tab": "general",
      "order": 30
    }),

  field.number("days", "Opening Balance", {
      "labelKey": "hr.leave-opening-balances.fields.days",
      "required": true,
      "hint": "Sisa saldo dari sistem lama, dalam hari.",
      "default": 0,
      "tab": "general",
      "order": 40
    }),

  field.date("join_date", "Join Date", {
      "labelKey": "hr.leave-opening-balances.fields.join_date",
      "readonly": true,
      "hint": "Dari kartu pegawai. Tidak disunting di sini.",
      "tab": "general",
      "order": 43
    }),

  field.date("eligible_date", "Eligible Date", {
      "labelKey": "hr.leave-opening-balances.fields.eligible_date",
      "readonly": true,
      "hint": "Join Date + masa tunggu di Leave Policy. Kosong berarti belum bisa dihitung — lihat kolom Reason.",
      "tab": "general",
      "order": 44
    }),

  field.text("validation_label", "Validation", {
      "labelKey": "hr.leave-opening-balances.fields.validation_label",
      "readonly": true,
      "hint": "VALID, VALID - NOT YET ELIGIBLE, atau REVIEW. REVIEW tidak menghalangi Post — ia menandai baris yang perlu dibaca orang lebih dulu.",
      "tab": "general",
      "order": 45
    }),

  field.textarea("validation_reason", "Reason", {
      "labelKey": "hr.leave-opening-balances.fields.validation_reason",
      "readonly": true,
      "hint": "Kenapa barisnya ditandai begitu.",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 46
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.leave-opening-balances.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.number("year", "Balance Year", {
      "labelKey": "hr.leave-opening-balances.fields.year",
      "hint": "Kartu saldo tahun berapa yang menerima angka ini. Dikosongkan = ikut tahun Opening Date.",
      "tab": "detail",
      "order": 110
    }),

  field.date("expires_at", "Expires At", {
      "labelKey": "hr.leave-opening-balances.fields.expires_at",
      "hint": "Terisi dari Leave Policy kalau cuti bawaan memang punya masa berlaku. Dikosongkan = tidak hangus.",
      "tab": "detail",
      "order": 120
    }),

  field.textarea("remark", "Remark", {
      "labelKey": "hr.leave-opening-balances.fields.remark",
      "hint": "Dari mana angkanya. Saldo awal tanpa keterangan tidak bisa dipertanggungjawabkan setahun kemudian.",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "detail",
      "order": 130
    }),

  field.date("posted_at", "Posted At", {
      "labelKey": "hr.leave-opening-balances.fields.posted_at",
      "readonly": true,
      "hint": "Kapan angkanya mulai berlaku di kartu cuti.",
      "modes": [
        "edit"
      ],
      "tab": "detail",
      "order": 135
    }),

  field.select("source", "Source", {
      "labelKey": "hr.leave-opening-balances.fields.source",
      "readonly": true,
      "displayKey": "source_label",
      "default": "manual",
      "multiple": false,
      "tab": "detail",
      "order": 140,
      "options": [
        {
          "label": "Manual",
          "value": "manual"
        },
        {
          "label": "Import",
          "value": "import"
        }
      ]
    }),
], {
  columns: 2,
})