import { createForm, field } from "@framework"

export const attendancePoliciesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "hr.attendance-policies.fields.code",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "hr.attendance-policies.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.text("scope_label", "Applies To", {
      "labelKey": "hr.attendance-policies.fields.scope_label",
      "readonly": true,
      "hint": "Ringkasan sasaran baris ini. \"Semua pegawai\" berarti aturan dasar — dipakai siapa pun yang tidak tercakup aturan yang lebih khusus.",
      "tab": "general",
      "order": 25
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "hr.attendance-policies.fields.company",
      "displayKey": "company_name",
      "hint": "Dikosongkan = berlaku untuk SEMUA company. Isi hanya kalau satu perusahaan memang punya aturan sendiri — aturan yang menyebut company mengalahkan yang dasar, dan hanya untuk pegawai perusahaan itu.",
      "tab": "general",
      "order": 30
    }),

  field.lookup("location", "Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "hr.attendance-policies.fields.location",
      "dependsOn": [
        "company"
      ],
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "location_name",
      "hint": "Dikosongkan = berlaku untuk semua lokasi di company itu. Inilah pembeda yang paling sering dipakai: site yang orangnya tinggal di mess tidak perlu kelonggaran macet seperti kantor pusat. Satu lokasi selalu milik satu company, jadi Company wajib diisi lebih dulu.",
      "tab": "general",
      "order": 40
    }),

  field.lookup("employee_group", "Employee Group", "/api/administration/references/hr/lookup/employee-groups/", {
      "labelKey": "hr.attendance-policies.fields.employee_group",
      "displayKey": "employee_group_name",
      "hint": "Dikosongkan = berlaku untuk semua golongan. Diisi kalau perlakuannya berbeda per golongan di tempat yang sama — mis. staf kantoran diberi kelonggaran, pekerja harian yang absennya menentukan upah tidak.",
      "tab": "general",
      "order": 50
    }),

  field.number("specificity", "Priority", {
      "labelKey": "hr.attendance-policies.fields.specificity",
      "readonly": true,
      "hint": "Dihitung dari sasaran yang diisi: company 4, lokasi 2, golongan 1. Angka tertinggi yang dipakai, jadi urutan baris di tabel tidak menentukan apa pun.",
      "tab": "general",
      "order": 55
    }),

  field.textarea("description", "Description", {
      "labelKey": "hr.attendance-policies.fields.description",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 60
    }),

  field.switch("require_supervisor_review", "Require supervisor review", {
      "labelKey": "hr.attendance-policies.fields.require_supervisor_review",
      "hint": "Kewajiban cuti harus ditinjau atasan langsung sebelum ditindaklanjuti. Dimatikan = HR langsung yang memutuskan.",
      "default": true,
      "tab": "general"
    }),

  field.switch("notify_employee", "Notify employee", {
      "labelKey": "hr.attendance-policies.fields.notify_employee",
      "hint": "Beri tahu pegawainya saat pengecualian terdeteksi.",
      "default": true,
      "tab": "general"
    }),

  field.switch("notify_supervisor", "Notify supervisor", {
      "labelKey": "hr.attendance-policies.fields.notify_supervisor",
      "hint": "Beri tahu atasan langsung (Reports To pegawainya). Bukan field supervisor tersendiri — garis pelaporan yang sudah ada yang dipakai.",
      "default": true,
      "tab": "general"
    }),

  field.switch("notify_hr", "Notify hr", {
      "labelKey": "hr.attendance-policies.fields.notify_hr",
      "hint": "Beri tahu HR juga. Dimatikan bawaannya: di tenant besar ini menghasilkan puluhan surat sehari untuk hal yang sudah ditangani atasannya.",
      "default": false,
      "tab": "general"
    }),

  field.number("late_tolerance_minutes", "Late Tolerance (minutes)", {
      "labelKey": "hr.attendance-policies.fields.late_tolerance_minutes",
      "hint": "Datang dalam batas ini masih dihitung hadir tepat waktu. Jam tap yang sebenarnya tetap tersimpan apa adanya.",
      "default": 0,
      "tab": "rules",
      "order": 110
    }),

  field.switch("late_counts_from_tolerance", "Count Late From Tolerance", {
      "labelKey": "hr.attendance-policies.fields.late_counts_from_tolerance",
      "hint": "Menyala: toleransi 15 dan datang menit ke-20 dihitung telat 5 menit. Mati: dihitung telat 20 menit, jadi toleransi hanya menentukan statusnya.",
      "default": true,
      "tab": "rules",
      "order": 120
    }),

  field.number("early_leave_tolerance_minutes", "Early Leave Tolerance (minutes)", {
      "labelKey": "hr.attendance-policies.fields.early_leave_tolerance_minutes",
      "hint": "Pulang lebih awal dalam batas ini tidak dihitung sebagai pulang cepat.",
      "default": 0,
      "tab": "rules",
      "order": 130
    }),

  field.number("late_leave_threshold_minutes", "Late → Leave Threshold (minutes)", {
      "labelKey": "hr.attendance-policies.fields.late_leave_threshold_minutes",
      "hint": "Telat lebih dari sekian menit dianggap mengambil cuti sebesar Leave Deduction. Dihitung dari jam jadwal, bukan dari batas toleransi. Dikosongkan = tidak dipakai.",
      "default": 0,
      "tab": "rules",
      "order": 132
    }),

  field.number("early_leave_leave_threshold_minutes", "Early Leave → Leave Threshold (minutes)", {
      "labelKey": "hr.attendance-policies.fields.early_leave_leave_threshold_minutes",
      "hint": "Pulang lebih awal dari sekian menit dianggap mengambil cuti. Dikosongkan = tidak dipakai.",
      "default": 0,
      "tab": "rules",
      "order": 134
    }),

  field.number("leave_deduction_days", "Leave Deduction (days)", {
      "labelKey": "hr.attendance-policies.fields.leave_deduction_days",
      "hint": "Hari cuti yang harus diambil begitu salah satu ambang di atas terlampaui. Bawaannya setengah hari. Sistem hanya menandai — yang memotong saldo tetap dokumen cuti yang diajukan dan disetujui.",
      "default": 0.5,
      "tab": "rules",
      "order": 136
    }),

  field.number("overtime_threshold_minutes", "Overtime Threshold (minutes)", {
      "labelKey": "hr.attendance-policies.fields.overtime_threshold_minutes",
      "hint": "Lewat jadwal minimal sekian menit baru dihitung lembur. Tanpa ambang, kolom lembur terisi satu-dua menit di hampir setiap baris.",
      "default": 30,
      "tab": "rules",
      "order": 140
    }),

  field.number("overtime_rounding_minutes", "Overtime Rounding (minutes)", {
      "labelKey": "hr.attendance-policies.fields.overtime_rounding_minutes",
      "hint": "Pembulatan ke bawah, mis. 30 berarti 95 menit dihitung 90. Dikosongkan = tanpa pembulatan.",
      "default": 0,
      "tab": "rules",
      "order": 150
    }),

  field.number("break_minutes", "Break (minutes)", {
      "labelKey": "hr.attendance-policies.fields.break_minutes",
      "hint": "Potongan istirahat untuk menghitung jam kerja bersih.",
      "default": 60,
      "tab": "rules",
      "order": 160
    }),

  field.switch("is_active", "Active", {
      "labelKey": "hr.attendance-policies.fields.is_active",
      "hint": "Dimatikan = aturannya diabaikan, dan pegawai yang tercakup jatuh ke aturan yang lebih umum.",
      "default": true,
      "tab": "rules",
      "order": 170
    }),

  field.number("sort_order", "Sort Order", {
      "labelKey": "hr.attendance-policies.fields.sort_order",
      "default": 0,
      "tab": "rules",
      "order": 180
    }),
], {
  columns: 2,
})