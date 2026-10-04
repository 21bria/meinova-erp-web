import { createForm, field } from "@framework"

export const overtimeGroupsForm = createForm([
  field.text("code", "Code", {
      "labelKey": "payroll.overtime-groups.fields.code",
      "required": true,
      "placeholder": "e.g. STANDARD",
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "payroll.overtime-groups.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.number("hourly_divisor", "Hourly Divisor", {
      "labelKey": "payroll.overtime-groups.fields.hourly_divisor",
      "required": true,
      "hint": "Pembagi gaji pokok sebulan untuk mendapatkan upah per jam. Bawaan 173 (Kepmenaker 102/2004). Gaji yang dipakai selalu gaji sebulan penuh, bukan yang sudah diprorata.",
      "default": 173,
      "tab": "general",
      "order": 30
    }),

  field.number("hourly_multiplier", "Default Multiplier", {
      "labelKey": "payroll.overtime-groups.fields.hourly_multiplier",
      "required": true,
      "hint": "Dipakai kalau kelompok ini belum punya tingkat. Diabaikan begitu ada tingkat yang aktif.",
      "default": 1,
      "tab": "general",
      "order": 40
    }),

  field.select("tier_basis", "Tier Basis", {
      "labelKey": "payroll.overtime-groups.fields.tier_basis",
      "placeholder": "Not set - required when using tiers",
      "displayKey": "tier_basis_label",
      "hint": "Wajib diisi kalau kelompok ini memakai tingkat. Keduanya lazim dan menghasilkan angka yang berbeda untuk pegawai yang sama, jadi sistem tidak memilihkan.",
      "default": "",
      "multiple": false,
      "layout": "full",
      "tab": "general",
      "order": 50,
      "options": [
        {
          "label": "Per overtime day - each day restarts at the first tier",
          "value": "daily"
        },
        {
          "label": "Total hours per month - all hours tiered once",
          "value": "monthly"
        }
      ]
    }),

  field.number("maximum_hours_per_day", "Max Hours / Day", {
      "labelKey": "payroll.overtime-groups.fields.maximum_hours_per_day",
      "tab": "general",
      "order": 60
    }),

  field.number("maximum_hours_per_month", "Max Hours / Month", {
      "labelKey": "payroll.overtime-groups.fields.maximum_hours_per_month",
      "tab": "general",
      "order": 70
    }),

  field.textarea("description", "Description", {
      "labelKey": "payroll.overtime-groups.fields.description",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 80
    }),

  field.switch("is_active", "Active", {
      "labelKey": "payroll.overtime-groups.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})