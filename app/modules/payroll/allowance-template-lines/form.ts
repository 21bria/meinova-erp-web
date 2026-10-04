import { createForm, field } from "@framework"

export const allowanceTemplateLinesForm = createForm([
  field.lookup("template", "Allowance Template", "/api/payroll/allowance-templates/lookup/", {
      "labelKey": "payroll.allowance-template-lines.fields.template",
      "required": true,
      "displayKey": "template_name",
      "tab": "general",
      "order": 10
    }),

  field.text("code", "Component Code", {
      "labelKey": "payroll.allowance-template-lines.fields.code",
      "required": true,
      "placeholder": "e.g. TRANSPORT",
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Component Name", {
      "labelKey": "payroll.allowance-template-lines.fields.name",
      "required": true,
      "placeholder": "e.g. Tunjangan Transport",
      "tab": "general",
      "order": 30
    }),

  field.number("sequence", "Sequence", {
      "labelKey": "payroll.allowance-template-lines.fields.sequence",
      "default": 1,
      "tab": "general",
      "order": 40
    }),

  field.select("basis", "Calculation Basis", {
      "labelKey": "payroll.allowance-template-lines.fields.basis",
      "required": true,
      "displayKey": "basis_label",
      "hint": "Menentukan kolom mana yang dipakai: Amount untuk nilai tetap dan satuan, Rate untuk persentase. Working Day = hari berhak menurut kebijakan prorata perusahaan; Paid Day = hari berhak dikurangi alpa dan cuti tidak dibayar; Attendance Day = hari yang benar-benar hadir menurut absensi. Basis per hari sudah mengandung harinya, jadi nilainya tidak diprorata lagi.",
      "default": "fixed",
      "multiple": false,
      "tab": "general",
      "order": 50,
      "options": [
        {
          "label": "Fixed Amount",
          "value": "fixed"
        },
        {
          "label": "% of Basic Salary",
          "value": "percent_of_basic"
        },
        {
          "label": "Amount x Working Day",
          "value": "per_working_day"
        },
        {
          "label": "Amount x Paid Day",
          "value": "per_paid_day"
        },
        {
          "label": "Amount x Attendance Day",
          "value": "per_attendance_day"
        },
        {
          "label": "Amount x Overtime Hour",
          "value": "per_overtime_hour"
        }
      ]
    }),

  field.number("amount", "Amount", {
      "labelKey": "payroll.allowance-template-lines.fields.amount",
      "visibleWhen": {
        "basis": [
          "fixed",
          "per_working_day",
          "per_paid_day",
          "per_attendance_day",
          "per_overtime_hour"
        ]
      },
      "default": 0,
      "tab": "general",
      "order": 60
    }),

  field.number("rate", "Rate (%)", {
      "labelKey": "payroll.allowance-template-lines.fields.rate",
      "visibleWhen": {
        "basis": [
          "percent_of_basic"
        ]
      },
      "default": 0,
      "tab": "general",
      "order": 70
    }),

  field.number("minimum_amount", "Minimum Amount", {
      "labelKey": "payroll.allowance-template-lines.fields.minimum_amount",
      "hint": "Dikenakan **sesudah** prorata, jadi artinya \"paling sedikit segini yang dibayar bulan ini\".",
      "tab": "general",
      "order": 80
    }),

  field.number("maximum_amount", "Maximum Amount", {
      "labelKey": "payroll.allowance-template-lines.fields.maximum_amount",
      "hint": "Dikenakan **sesudah** prorata, jadi artinya \"paling banyak segini yang dibayar bulan ini\".",
      "tab": "general",
      "order": 90
    }),

  field.switch("is_taxable", "Taxable", {
      "labelKey": "payroll.allowance-template-lines.fields.is_taxable",
      "displayKey": "is_taxable_label",
      "hint": "Ikut menambah dasar perhitungan PPh21. Yang menentukan kebijakan perusahaan, bukan nama komponennya.",
      "default": true,
      "tab": "general",
      "order": 100
    }),

  field.switch("is_prorated", "Prorated", {
      "labelKey": "payroll.allowance-template-lines.fields.is_prorated",
      "displayKey": "is_prorated_label",
      "hint": "Hanya berlaku untuk basis Fixed Amount dan % of Basic Salary. Pegawai yang masuk atau berhenti di tengah periode menerima sebagian, mengikuti metode prorata gaji pokok perusahaan. Basis per hari mengabaikan saklar ini karena nilainya sudah mengandung harinya. Tidak dipengaruhi absen atau cuti tidak dibayar — itu jalur potongan yang terpisah.",
      "default": true,
      "tab": "general",
      "order": 110
    }),

  field.textarea("description", "Description", {
      "labelKey": "payroll.allowance-template-lines.fields.description",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 120
    }),

  field.switch("is_active", "Active", {
      "labelKey": "payroll.allowance-template-lines.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})