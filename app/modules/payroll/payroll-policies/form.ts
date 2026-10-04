import { createForm, field } from "@framework"

export const payrollPoliciesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "payroll.payroll-policies.fields.code",
      "required": true,
      "placeholder": "e.g. HO-MONTHLY",
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "payroll.payroll-policies.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "payroll.payroll-policies.fields.company",
      "required": true,
      "displayKey": "company_name",
      "hint": "Kebijakan hanya boleh dipakai pegawai perusahaan ini.",
      "tab": "general",
      "order": 30
    }),

  field.select("pay_basis", "Pay Basis", {
      "labelKey": "payroll.payroll-policies.fields.pay_basis",
      "required": true,
      "displayKey": "pay_basis_label",
      "hint": "Menentukan kolom mana di bawah yang berlaku. Aturan bulanan tidak berlaku untuk dasar harian dan sebaliknya — yang salah tempat ditolak saat disimpan.",
      "default": "monthly",
      "multiple": false,
      "tab": "general",
      "order": 40,
      "options": [
        {
          "label": "Monthly - a monthly salary split into daily entitlement",
          "value": "monthly"
        },
        {
          "label": "Daily - wage built from the days paid",
          "value": "daily"
        }
      ]
    }),

  field.select("proration_method", "Monthly - Salary Proration Method", {
      "labelKey": "payroll.payroll-policies.fields.proration_method",
      "placeholder": "Follow the company policy",
      "displayKey": "proration_method_label",
      "hint": "Cara gaji sebulan dipecah untuk pegawai yang masuk atau berhenti di tengah periode. Dikosongkan = ikut Payroll Setting perusahaan.",
      "default": "",
      "multiple": false,
      "tab": "general",
      "order": 50,
      "options": [
        {
          "label": "Fixed 30 Days",
          "value": "fixed_30"
        },
        {
          "label": "Calendar Days",
          "value": "calendar_days"
        },
        {
          "label": "Working Days",
          "value": "working_days"
        }
      ]
    }),

  field.select("prorate_on_join", "Monthly - Prorate on Join", {
      "labelKey": "payroll.payroll-policies.fields.prorate_on_join",
      "hint": "Pegawai yang masuk di tengah periode diprorata.",
      "default": "inherit",
      "multiple": false,
      "tab": "general",
      "order": 52,
      "options": [
        {
          "label": "Ikut kebijakan perusahaan",
          "value": "inherit"
        },
        {
          "label": "Ya",
          "value": "on"
        },
        {
          "label": "Tidak",
          "value": "off"
        }
      ]
    }),

  field.select("prorate_on_termination", "Monthly - Prorate on Termination", {
      "labelKey": "payroll.payroll-policies.fields.prorate_on_termination",
      "hint": "Pegawai yang berhenti di tengah periode diprorata.",
      "default": "inherit",
      "multiple": false,
      "tab": "general",
      "order": 54,
      "options": [
        {
          "label": "Ikut kebijakan perusahaan",
          "value": "inherit"
        },
        {
          "label": "Ya",
          "value": "on"
        },
        {
          "label": "Tidak",
          "value": "off"
        }
      ]
    }),

  field.select("attendance_deduction_method", "Monthly - Absence Deduction Method", {
      "labelKey": "payroll.payroll-policies.fields.attendance_deduction_method",
      "placeholder": "Follow the company policy",
      "displayKey": "attendance_deduction_method_label",
      "hint": "Pembagi nilai sehari untuk potongan alpa dan cuti tidak dibayar. Boleh berbeda dari metode prorata di atas.",
      "default": "",
      "multiple": false,
      "tab": "general",
      "order": 56,
      "options": [
        {
          "label": "Fixed 30 Days",
          "value": "fixed_30"
        },
        {
          "label": "Calendar Days",
          "value": "calendar_days"
        },
        {
          "label": "Working Days",
          "value": "working_days"
        }
      ]
    }),

  field.select("deduct_absence", "Monthly - Deduct Absence", {
      "labelKey": "payroll.payroll-policies.fields.deduct_absence",
      "hint": "Hari alpa memotong gaji.",
      "default": "inherit",
      "multiple": false,
      "tab": "general",
      "order": 58,
      "options": [
        {
          "label": "Ikut kebijakan perusahaan",
          "value": "inherit"
        },
        {
          "label": "Ya",
          "value": "on"
        },
        {
          "label": "Tidak",
          "value": "off"
        }
      ]
    }),

  field.select("deduct_unpaid_leave", "Monthly - Deduct Unpaid Leave", {
      "labelKey": "payroll.payroll-policies.fields.deduct_unpaid_leave",
      "hint": "Hari cuti berjenis tidak dibayar memotong gaji. Jenis cuti mana yang tidak dibayar tetap ditentukan Payroll Leave Rule.",
      "default": "inherit",
      "multiple": false,
      "tab": "general",
      "order": 60,
      "options": [
        {
          "label": "Ikut kebijakan perusahaan",
          "value": "inherit"
        },
        {
          "label": "Ya",
          "value": "on"
        },
        {
          "label": "Tidak",
          "value": "off"
        }
      ]
    }),

  field.select("daily_rate_method", "Daily - Daily Rate Method", {
      "labelKey": "payroll.payroll-policies.fields.daily_rate_method",
      "placeholder": "Not set - required for the Daily basis",
      "displayKey": "daily_rate_method_label",
      "hint": "Sistem tidak memilihkan: kedua caranya lazim dan menghasilkan upah yang berbeda.",
      "default": "",
      "multiple": false,
      "tab": "general",
      "order": 70,
      "options": [
        {
          "label": "Daily rate recorded on the Payroll Assignment",
          "value": "assignment_rate"
        },
        {
          "label": "Monthly salary divided by the divisor below",
          "value": "from_monthly"
        }
      ]
    }),

  field.number("daily_rate_divisor", "Daily - Monthly Salary Divisor", {
      "labelKey": "payroll.payroll-policies.fields.daily_rate_divisor",
      "hint": "Mis. 25 atau 30. Hanya dipakai kalau upah sehari diturunkan dari gaji sebulan.",
      "tab": "general",
      "order": 72
    }),

  field.select("pay_paid_leave", "Daily - Approved Leave Days", {
      "labelKey": "payroll.payroll-policies.fields.pay_paid_leave",
      "placeholder": "Not set - required for the Daily basis",
      "displayKey": "pay_paid_leave_label",
      "hint": "Belum ada aturan baku di sistem ini untuk pekerja harian pada hari cuti. Payroll Leave Rule menjawab pertanyaan yang berbeda — jenis cuti mana yang memotong gaji bulanan.",
      "default": "",
      "multiple": false,
      "layout": "full",
      "tab": "general",
      "order": 74,
      "options": [
        {
          "label": "Dibayar - hari cuti tetap menghasilkan upah sehari",
          "value": "yes"
        },
        {
          "label": "Tidak dibayar - hanya hari kerja nyata yang dibayar",
          "value": "no"
        }
      ]
    }),

  field.textarea("description", "Description", {
      "labelKey": "payroll.payroll-policies.fields.description",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 90
    }),

  field.textarea("rules_summary", "Ringkasan Aturan", {
      "labelKey": "payroll.payroll-policies.fields.rules_summary",
      "readonly": true,
      "rows": 7,
      "layout": "full",
      "tab": "general",
      "order": 95
    }),

  field.switch("is_active", "Active", {
      "labelKey": "payroll.payroll-policies.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})