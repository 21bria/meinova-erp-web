import { createForm, field } from "@framework"

export const rosterSetupsForm = createForm([
  field.text("document_number", "Document No.", {
      "labelKey": "hr.roster-setups.fields.document_number",
      "disabled": true,
      "hint": "Terisi otomatis dari pola penomoran hr/roster_setup. Kosong berarti polanya belum diseed — jalankan seed_administration --only=numbering.",
      "modes": [
        "edit"
      ],
      "default": "",
      "tab": "general",
      "order": 5
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "hr.roster-setups.fields.company",
      "required": true,
      "displayKey": "company_name",
      "readonlyWhen": {
        "field": "$me.data_scope.values.company",
        "op": "is_not_null"
      },
      "hint": "Menyaring Site dan Section di bawahnya. Satu-satunya level organisasi yang wajib.",
      "default": "$me.placement.company",
      "tab": "general",
      "order": 8
    }),

  field.lookup("location", "Site", "/api/administration/organization/lookup/locations/", {
      "labelKey": "hr.roster-setups.fields.location",
      "required": true,
      "dependsOn": "company",
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "location_name",
      "readonlyWhen": {
        "field": "$me.data_scope.values.location",
        "op": "is_not_null"
      },
      "hint": "Satu dokumen = satu site. Batch yang mencampur site membuat meja persetujuannya tidak bisa ditentukan.",
      "default": "$me.placement.location",
      "tab": "general",
      "order": 10
    }),

  field.lookup("department", "Department", "/api/administration/organization/lookup/departments/", {
      "labelKey": "hr.roster-setups.fields.department",
      "dependsOn": [
        "company",
        "location"
      ],
      "lookupParams": {
        "company_id": "$company",
        "location_id": "$location"
      },
      "displayKey": "department_name",
      "hint": "Penyaring opsional di bawah Site. Kosong = seluruh site.",
      "default": "$me.placement.department",
      "tab": "general",
      "order": 12
    }),

  field.lookup("section", "Section", "/api/administration/organization/lookup/sections/", {
      "labelKey": "hr.roster-setups.fields.section",
      "dependsOn": [
        "company",
        "location"
      ],
      "lookupParams": {
        "company_id": "$company",
        "location_id": "$location",
        "department_id": "$department"
      },
      "displayKey": "section_name",
      "hint": "Penyaring opsional, dan yang disaringnya adalah daftar kandidat di tombol Add Employees — bukan pengisi baris otomatis. Kosong = seluruh department.",
      "default": "$me.placement.section",
      "tab": "general",
      "order": 15
    }),

  field.date("as_of_date", "As Of Date", {
      "labelKey": "hr.roster-setups.fields.as_of_date",
      "required": true,
      "hint": "Keadaan direkam per tanggal ini. Jadwal berangkat dari blok yang sedang dijalani pegawai, bukan dari awal riwayatnya.",
      "tab": "general",
      "order": 20
    }),

  field.number("horizon_months", "Horizon (Months)", {
      "labelKey": "hr.roster-setups.fields.horizon_months",
      "hint": "Jadwal digenerate sampai sekian bulan ke depan. Dibatasi 24 bulan; perpanjangannya nanti otomatis lewat rolling horizon.",
      "default": 12,
      "tab": "general",
      "order": 25
    }),

  field.number("line_count", "Employees", {
      "labelKey": "hr.roster-setups.fields.line_count",
      "readonly": true,
      "modes": [
        "edit"
      ],
      "tab": "general",
      "order": 32
    }),

  field.number("committed_count", "Committed", {
      "labelKey": "hr.roster-setups.fields.committed_count",
      "readonly": true,
      "modes": [
        "edit"
      ],
      "tab": "general",
      "order": 33
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.roster-setups.fields.notes",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 40
    }),

  field.textarea("commit_error", "Commit Error", {
      "labelKey": "hr.roster-setups.fields.commit_error",
      "readonly": true,
      "visibleWhen": {
        "status": [
          "partial"
        ]
      },
      "hint": "Baris yang gagal diterbitkan. Perbaiki datanya lalu tekan Commit lagi — baris yang sudah berhasil tidak diulang.",
      "modes": [
        "edit"
      ],
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 45
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.roster-setups.fields.is_active",
      "default": true,
      "tab": "general"
    }),
], {
  columns: 3,
})