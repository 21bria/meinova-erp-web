import { createForm, field } from "@framework"

export const bpjsBaseDefinitionsForm = createForm([
  field.text("code", "Code", {
      "labelKey": "payroll.bpjs-base-definitions.fields.code",
      "required": true,
      "hint": "Mis. UPAH-POKOK-TETAP.",
      "tab": "general",
      "order": 10
    }),

  field.number("version", "Version", {
      "labelKey": "payroll.bpjs-base-definitions.fields.version",
      "required": true,
      "hint": "Naikkan versinya untuk mengubah komposisi. Versi lama tetap dipakai aturan yang sudah menunjuknya.",
      "default": 1,
      "tab": "general",
      "order": 20
    }),

  field.text("name", "Name", {
      "labelKey": "payroll.bpjs-base-definitions.fields.name",
      "required": true,
      "tab": "general",
      "order": 30
    }),

  field.switch("include_basic", "Include Basic Salary", {
      "labelKey": "payroll.bpjs-base-definitions.fields.include_basic",
      "hint": "Gaji pokok sebulan menurut kontrak, bukan yang sudah diprorata.",
      "default": true,
      "tab": "general",
      "order": 40
    }),

  field.select("daily_basic_method", "Daily Employee Base", {
      "labelKey": "payroll.bpjs-base-definitions.fields.daily_basic_method",
      "hint": "Cara membentuk dasar iuran pegawai berbasis harian. Tidak diatur = dasarnya nol dan terbit peringatan.",
      "default": "none",
      "multiple": false,
      "tab": "general",
      "order": 45,
      "options": [
        {
          "value": "none",
          "label": "Not configured"
        },
        {
          "value": "daily_rate_x_factor",
          "label": "Daily Wage x Multiplier"
        },
        {
          "value": "paid_days_x_daily_rate",
          "label": "Paid Days x Daily Wage"
        }
      ]
    }),

  field.number("daily_basic_factor", "Daily Factor", {
      "labelKey": "payroll.bpjs-base-definitions.fields.daily_basic_factor",
      "visibleWhen": {
        "daily_basic_method": "daily_rate_x_factor"
      },
      "hint": "Pengali upah sehari jadi dasar sebulan. Tidak ada bawaan: angkanya kebijakan yang harus ditulis.",
      "tab": "general",
      "order": 46
    }),

  field.textarea("description", "Description", {
      "labelKey": "payroll.bpjs-base-definitions.fields.description",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 70
    }),

  field.switch("is_active", "Active", {
      "labelKey": "payroll.bpjs-base-definitions.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})