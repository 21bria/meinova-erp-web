import { createForm, field } from "@framework"

export const bpjsEnrollmentsForm = createForm([
  field.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "payroll.bpjs-enrollments.fields.employee",
      "required": true,
      "displayKey": "employee_name",
      "tab": "general",
      "order": 10
    }),

  field.lookup("program", "Program", "/api/payroll/bpjs-programs/lookup/", {
      "labelKey": "payroll.bpjs-enrollments.fields.program",
      "required": true,
      "displayKey": "program_name",
      "tab": "general",
      "order": 20
    }),

  field.switch("participates", "Participates", {
      "labelKey": "payroll.bpjs-enrollments.fields.participates",
      "hint": "Dimatikan = tidak ikut program ini, tanpa menghapus riwayat kepesertaannya.",
      "default": true,
      "tab": "general",
      "order": 30
    }),

  field.date("enrolled_from", "Enrolled From", {
      "labelKey": "payroll.bpjs-enrollments.fields.enrolled_from",
      "required": true,
      "tab": "general",
      "order": 40
    }),

  field.date("enrolled_to", "Enrolled To", {
      "labelKey": "payroll.bpjs-enrollments.fields.enrolled_to",
      "hint": "Kosong = masih terdaftar.",
      "tab": "general",
      "order": 50
    }),

  field.lookup("risk_class", "Risk Class", "/api/payroll/bpjs-risk-classes/lookup/", {
      "labelKey": "payroll.bpjs-enrollments.fields.risk_class",
      "displayKey": "risk_class_name",
      "hint": "Wajib untuk program yang memakai kelas risiko. Perpindahan kelas ditulis sebagai penutupan kepesertaan lama dan pembukaan yang baru, supaya riwayatnya tidak tertulis ulang.",
      "tab": "general",
      "order": 55
    }),

  field.text("membership_number", "Membership Number", {
      "labelKey": "payroll.bpjs-enrollments.fields.membership_number",
      "hint": "Kosong tetap dihitung iurannya, dengan peringatan — iuran yang hilang karena satu kolom administratif belum diisi adalah gaji yang salah.",
      "tab": "general",
      "order": 60
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "payroll.bpjs-enrollments.fields.notes",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 70
    }),

  field.switch("is_active", "Active", {
      "labelKey": "payroll.bpjs-enrollments.fields.is_active",
      "default": true,
      "tab": "general",
      "order": 999
    }),
], {
  columns: 2,
})