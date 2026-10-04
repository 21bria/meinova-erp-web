import { createForm, field } from "@framework"

export const leaveGoLiveForm = createForm([
  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "hr.leave-go-live.fields.company",
      "required": true,
      "displayKey": "company_name",
      "hint": "Perusahaan yang cutinya mulai dikelola di sistem ini. Satu baris per perusahaan.",
      "tab": "general",
      "order": 10
    }),

  field.date("go_live_date", "Go-Live Date", {
      "labelKey": "hr.leave-go-live.fields.go_live_date",
      "required": true,
      "hint": "Hari pertama cuti dikelola di sini. Jatah tahun ini TIDAK diterbitkan untuk pegawai yang sudah bekerja sebelum tanggal ini — saldonya datang dari Leave Opening Balance.",
      "tab": "general",
      "order": 20
    }),

  field.date("cutoff_date", "Cut-Off Date", {
      "labelKey": "hr.leave-go-live.fields.cutoff_date",
      "readonly": true,
      "hint": "Hari terakhir yang masih dipegang sistem lama. Angka saldo awal harus menyatakan keadaan per tanggal ini.",
      "tab": "general",
      "order": 30
    }),

  field.switch("is_active", "Active", {
      "labelKey": "hr.leave-go-live.fields.is_active",
      "hint": "Matikan untuk mengembalikan perhitungan jatah ke aturan biasa. Saldo awal yang sudah di-post tidak ikut hilang.",
      "default": true,
      "tab": "general",
      "order": 40
    }),

  field.number("draft_count", "Opening Balance — Draft", {
      "labelKey": "hr.leave-go-live.fields.draft_count",
      "readonly": true,
      "hint": "Baris saldo awal yang belum di-post. Belum memengaruhi kartu cuti siapa pun.",
      "modes": [
        "edit"
      ],
      "tab": "progress",
      "order": 110
    }),

  field.number("posted_count", "Opening Balance — Posted", {
      "labelKey": "hr.leave-go-live.fields.posted_count",
      "readonly": true,
      "hint": "Baris yang angkanya sudah berlaku di kartu cuti.",
      "modes": [
        "edit"
      ],
      "tab": "progress",
      "order": 120
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.leave-go-live.fields.notes",
      "hint": "Dari sistem apa datanya dipindah, dan siapa yang menyerahkan angkanya.",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "progress",
      "order": 130
    }),
], {
  columns: 2,
})