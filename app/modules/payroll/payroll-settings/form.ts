import { createForm, field } from "@framework"

export const payrollSettingsForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "payroll.payroll-settings.fields.company",
      "required": true,
      "displayKey": "company_name",
      "tab": "general",
      "order": 10
    }),

  field.select("proration_method", "Salary Proration Method", {
      "labelKey": "payroll.payroll-settings.fields.proration_method",
      "required": true,
      "displayKey": "proration_method_label",
      "hint": "Cara gaji sebulan dipecah jadi hak harian untuk pegawai yang masuk atau berhenti di tengah periode. Fixed 30: nilai sehari sama sepanjang tahun. Calendar days: mengikuti panjang bulannya. Working days: mengikuti kalender kerja dan hari libur pegawai.",
      "default": "calendar_days",
      "multiple": false,
      "layout": "full",
      "tab": "general",
      "order": 20,
      "options": [
        {
          "label": "Fixed 30 days per month",
          "value": "fixed_30"
        },
        {
          "label": "Calendar days in the month (28-31)",
          "value": "calendar_days"
        },
        {
          "label": "Working days in the month",
          "value": "working_days"
        }
      ]
    }),

  field.switch("prorate_on_join", "Prorate New Joiners", {
      "labelKey": "payroll.payroll-settings.fields.prorate_on_join",
      "hint": "Pegawai yang masuk di tengah periode dibayar sejak tanggal masuknya. Dimatikan berarti ia menerima gaji sebulan penuh.",
      "default": true,
      "tab": "general",
      "order": 30
    }),

  field.switch("prorate_on_termination", "Prorate Leavers", {
      "labelKey": "payroll.payroll-settings.fields.prorate_on_termination",
      "hint": "Pegawai yang berhenti di tengah periode dibayar sampai hari terakhirnya. Dimatikan berarti ia menerima gaji sebulan penuh.",
      "default": true,
      "tab": "general",
      "order": 40
    }),

  field.select("attendance_deduction_method", "Attendance Deduction Method", {
      "labelKey": "payroll.payroll-settings.fields.attendance_deduction_method",
      "placeholder": "Belum ditentukan - memakai hari kerja periode payroll",
      "displayKey": "attendance_deduction_method_label",
      "hint": "Pembagi yang dipakai menghitung nilai sehari untuk potongan absen dan cuti tidak dibayar. Boleh berbeda dari metode prorata di atas — prorata menentukan hak gaji, ini menentukan berapa yang hilang per hari tidak masuk.",
      "default": "",
      "multiple": false,
      "layout": "full",
      "tab": "general",
      "order": 50,
      "options": [
        {
          "label": "Fixed 30 days per month",
          "value": "fixed_30"
        },
        {
          "label": "Calendar days in the month (28-31)",
          "value": "calendar_days"
        },
        {
          "label": "Working days in the month",
          "value": "working_days"
        }
      ]
    }),

  field.switch("deduct_absence", "Deduct Absence", {
      "labelKey": "payroll.payroll-settings.fields.deduct_absence",
      "hint": "Hari yang tercatat alpa di absensi memotong gaji. Dimatikan berarti harinya tetap tercatat tapi tidak memotong.",
      "default": true,
      "tab": "general",
      "order": 60
    }),

  field.switch("deduct_unpaid_leave", "Deduct Unpaid Leave", {
      "labelKey": "payroll.payroll-settings.fields.deduct_unpaid_leave",
      "hint": "Hari cuti tidak dibayar memotong gaji. Jenis cuti mana yang tidak dibayar tetap ditentukan Payroll Leave Rule, bukan di sini.",
      "default": true,
      "tab": "general",
      "order": 70
    }),

  field.switch("is_active", "Active", {
      "labelKey": "payroll.payroll-settings.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})