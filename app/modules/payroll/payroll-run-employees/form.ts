import { createForm, field } from "@framework"

export const payrollRunEmployeesForm = createForm([
  field.number("period_days", "Period Days", {
      "labelKey": "payroll.payroll-run-employees.fields.period_days",
      "readonly": true,
      "default": 0,
      "tab": "days",
      "order": 10
    }),

  field.textarea("components_summary", "Component Breakdown", {
      "labelKey": "payroll.payroll-run-employees.fields.components_summary",
      "readonly": true,
      "hint": "Seluruh komponen yang membentuk Gross Earning dan Total Deduction baris ini, lengkap dengan cara tiap angkanya dihitung.",
      "rows": 18,
      "layout": "full",
      "tab": "breakdown",
      "order": 10
    }),

  field.number("working_days", "Eligible Days", {
      "labelKey": "payroll.payroll-run-employees.fields.working_days",
      "readonly": true,
      "hint": "Hari yang benar-benar dalam masa kerja pegawai di periode ini — pembilang prorata. Satuannya mengikuti metode: hari kalender untuk Fixed 30 dan Calendar Days, hari kerja untuk Working Days.",
      "default": 0,
      "tab": "days",
      "order": 20
    }),

  field.number("paid_days", "Paid Days", {
      "labelKey": "payroll.payroll-run-employees.fields.paid_days",
      "readonly": true,
      "default": 0,
      "tab": "days",
      "order": 30
    }),

  field.number("attendance_days", "Attendance Days", {
      "labelKey": "payroll.payroll-run-employees.fields.attendance_days",
      "readonly": true,
      "default": 0,
      "tab": "days",
      "order": 40
    }),

  field.number("absent_days", "Absent Days", {
      "labelKey": "payroll.payroll-run-employees.fields.absent_days",
      "readonly": true,
      "default": 0,
      "tab": "days",
      "order": 50
    }),

  field.number("leave_days", "Leave Days", {
      "labelKey": "payroll.payroll-run-employees.fields.leave_days",
      "readonly": true,
      "hint": "Seluruh hari cuti, dibayar maupun tidak.",
      "default": 0,
      "tab": "days",
      "order": 60
    }),

  field.number("paid_leave_days", "Paid Leave Days", {
      "labelKey": "payroll.payroll-run-employees.fields.paid_leave_days",
      "readonly": true,
      "hint": "Hari cuti yang tidak memotong gaji. Yang menentukan dibayar atau tidak adalah Payroll Leave Rule per jenis cuti.",
      "tab": "days",
      "order": 62
    }),

  field.number("unpaid_leave_days", "Unpaid Leave Days", {
      "labelKey": "payroll.payroll-run-employees.fields.unpaid_leave_days",
      "readonly": true,
      "default": 0,
      "tab": "days",
      "order": 70
    }),

  field.text("payroll_policy_label", "Calculation Policy", {
      "labelKey": "payroll.payroll-run-employees.fields.payroll_policy_label",
      "readonly": true,
      "hint": "Kebijakan yang dibekukan bersama snapshot ini. Mengganti kebijakan bulan depan tidak mengubah angka periode ini.",
      "tab": "snapshot",
      "order": 74
    }),

  field.number("daily_rate", "Upah Sehari", {
      "labelKey": "payroll.payroll-run-employees.fields.daily_rate",
      "readonly": true,
      "hint": "Hanya untuk dasar Harian. Ditampilkan enam desimal karena tarif yang diturunkan dari gaji sebulan jarang bulat, dan angka yang sudah dibulatkan tidak menghasilkan upah yang dibayar.",
      "default": 0,
      "tab": "snapshot",
      "order": 76
    }),

  field.number("overtime_hours", "Overtime Hours", {
      "labelKey": "payroll.payroll-run-employees.fields.overtime_hours",
      "readonly": true,
      "default": 0,
      "tab": "days",
      "order": 80
    }),

  field.text("proration_method_label", "Proration Method", {
      "labelKey": "payroll.payroll-run-employees.fields.proration_method_label",
      "readonly": true,
      "hint": "Kebijakan perusahaan yang berlaku saat run ini dihitung. Dibekukan di sini, jadi mengubah kebijakan bulan depan tidak mengubah angka periode ini.",
      "tab": "days",
      "order": 85
    }),

  field.number("proration_base_days", "Proration Base Days", {
      "labelKey": "payroll.payroll-run-employees.fields.proration_base_days",
      "readonly": true,
      "hint": "Pembagi hari yang dipakai metode di atas.",
      "default": 0,
      "tab": "days",
      "order": 88
    }),

  field.number("proration_factor", "Proration Factor", {
      "labelKey": "payroll.payroll-run-employees.fields.proration_factor",
      "readonly": true,
      "default": 1,
      "tab": "days",
      "order": 90
    }),

  field.text("attendance_deduction_method_label", "Attendance Deduction Method", {
      "labelKey": "payroll.payroll-run-employees.fields.attendance_deduction_method_label",
      "readonly": true,
      "hint": "Kebijakan potongan yang berlaku saat run ini dihitung, dibekukan di sini. Boleh berbeda dari metode prorata.",
      "tab": "days",
      "order": 92
    }),

  field.number("deduction_base_days", "Deduction Base Days", {
      "labelKey": "payroll.payroll-run-employees.fields.deduction_base_days",
      "readonly": true,
      "hint": "Pembagi hari untuk nilai sehari yang dipotong. Diambil dari periode penuh, bukan dari masa kerja pegawai — prorata gaji pokok sudah diperhitungkan sekali di atas.",
      "default": 0,
      "tab": "days",
      "order": 94
    }),

  field.number("absence_deduction", "Absence Deduction", {
      "labelKey": "payroll.payroll-run-employees.fields.absence_deduction",
      "readonly": true,
      "default": 0,
      "tab": "days",
      "order": 96
    }),

  field.number("unpaid_leave_deduction", "Unpaid Leave Deduction", {
      "labelKey": "payroll.payroll-run-employees.fields.unpaid_leave_deduction",
      "readonly": true,
      "default": 0,
      "tab": "days",
      "order": 98
    }),

  field.switch("is_excluded", "Excluded", {
      "labelKey": "payroll.payroll-run-employees.fields.is_excluded",
      "hint": "Dikeluarkan dari perhitungan run ini. Barisnya tetap ada supaya alasannya bisa dibaca.",
      "default": false,
      "tab": "general",
      "order": 100
    }),

  field.textarea("exclusion_reason", "Exclusion Reason", {
      "labelKey": "payroll.payroll-run-employees.fields.exclusion_reason",
      "visibleWhen": {
        "is_excluded": true
      },
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 110
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "payroll.payroll-run-employees.fields.notes",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 120
    }),
], {
  columns: 3,
})