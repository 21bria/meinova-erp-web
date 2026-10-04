import { createForm, field } from "@framework"

export const siteRotationsForm = createForm([
  field.text("document_number", "Roster No.", {
      "labelKey": "hr.site-rotations.fields.document_number",
      "disabled": true,
      "hint": "Terisi otomatis dari pola penomoran hr/site_rotation. Kosong berarti pola itu belum diseed — jalankan seed_administration --only=numbering.",
      "default": "",
      "tab": "general",
      "order": 5
    }),

  field.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "hr.site-rotations.fields.employee",
      "required": true,
      "autofill": {
        "company": "company",
        "branch": "branch",
        "location": "location"
      },
      "lookupParams": {
        "feature": "roster"
      },
      "displayKey": "employee_name",
      "tab": "general",
      "order": 10
    }),

  field.lookup("roster_crew", "Roster Crew", "/api/administration/calendar/lookup/roster-crews/", {
      "labelKey": "hr.site-rotations.fields.roster_crew",
      "lookupParams": {
        "company_id": "$company",
        "location_id": "$location"
      },
      "displayKey": "roster_crew_name",
      "hint": "Gelombang rotasi — jalur lama. Kosong itu wajar untuk jadwal yang terbit dari dokumen Roster Setup: polanya datang dari Roster Policy, bukan dari crew.",
      "tab": "general",
      "order": 20
    }),

  field.lookup("roster_policy", "Roster Policy", "/api/administration/references/hr/lookup/roster-policies/", {
      "labelKey": "hr.site-rotations.fields.roster_policy",
      "displayKey": "roster_policy_name",
      "hint": "Aturan yang menerbitkan jadwal ini: pola siklus, hari perjalanan, dan konversi rotation credit.",
      "tab": "general",
      "order": 25
    }),

  field.select("status", "Status", {
      "labelKey": "hr.site-rotations.fields.status",
      "required": true,
      "displayKey": "status_label",
      "default": "planned",
      "multiple": false,
      "tab": "general",
      "order": 30,
      "options": [
        {
          "label": "Planned",
          "value": "planned"
        },
        {
          "label": "Active",
          "value": "active"
        },
        {
          "label": "Completed",
          "value": "completed"
        },
        {
          "label": "Cancelled",
          "value": "cancelled"
        }
      ]
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.site-rotations.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.date("cycle_start", "Cycle start", {
      "labelKey": "hr.site-rotations.fields.cycle_start",
      "hint": "Current Cycle Start yang dibekukan ke rencana ini.",
      "tab": "general"
    }),

  field.text("roster_start_basis", "Roster start basis", {
      "labelKey": "hr.site-rotations.fields.roster_start_basis",
      "default": "work_start",
      "tab": "general"
    }),

  field.number("travel_out_days", "Travel out days", {
      "labelKey": "hr.site-rotations.fields.travel_out_days",
      "default": 0,
      "tab": "general"
    }),

  field.number("travel_in_days", "Travel in days", {
      "labelKey": "hr.site-rotations.fields.travel_in_days",
      "default": 0,
      "tab": "general"
    }),

  field.text("travel_day_mode", "Travel day mode", {
      "labelKey": "hr.site-rotations.fields.travel_day_mode",
      "default": "fixed",
      "tab": "general"
    }),

  field.switch("travel_creates_segment", "Travel creates segment", {
      "labelKey": "hr.site-rotations.fields.travel_creates_segment",
      "default": true,
      "tab": "general"
    }),

  field.switch("travel_out_counts_as_roster_day", "Travel out counts as roster day", {
      "labelKey": "hr.site-rotations.fields.travel_out_counts_as_roster_day",
      "default": false,
      "tab": "general"
    }),

  field.switch("travel_in_counts_as_roster_day", "Travel in counts as roster day", {
      "labelKey": "hr.site-rotations.fields.travel_in_counts_as_roster_day",
      "default": false,
      "tab": "general"
    }),

  field.date("effective_from", "Effective from", {
      "labelKey": "hr.site-rotations.fields.effective_from",
      "tab": "general"
    }),

  field.date("effective_to", "Effective to", {
      "labelKey": "hr.site-rotations.fields.effective_to",
      "hint": "Kosong = era berjalan.",
      "tab": "general"
    }),

  field.date("horizon_end", "Horizon end", {
      "labelKey": "hr.site-rotations.fields.horizon_end",
      "hint": "Sampai kapan segmen sudah digenerate.",
      "tab": "general"
    }),

  field.datetime("submitted_at", "Submitted at", {
      "labelKey": "hr.site-rotations.fields.submitted_at",
      "tab": "general"
    }),

  field.datetime("approved_at", "Approved at", {
      "labelKey": "hr.site-rotations.fields.approved_at",
      "tab": "general"
    }),

  field.datetime("locked_at", "Locked at", {
      "labelKey": "hr.site-rotations.fields.locked_at",
      "hint": "Saat baseline dikunci. Sesudah ini jadwal hanya berubah lewat dokumen Adjustment.",
      "tab": "general"
    }),

  field.text("approval", "Approval", {
      "labelKey": "hr.site-rotations.fields.approval",
      "tab": "general"
    }),

  field.date("start_date", "Start Date", {
      "labelKey": "hr.site-rotations.fields.start_date",
      "hint": "Hari pertama blok kerja siklus pertama. Dikosongkan saat membuat dokumen = diambil dari jangkar siklus crew, digeser maju ke siklus terdekat.",
      "tab": "cycle",
      "order": 110
    }),

  field.number("cycle_work_days", "Work Days", {
      "labelKey": "hr.site-rotations.fields.cycle_work_days",
      "hint": "Mis. 42 untuk pola 6 minggu kerja.",
      "tab": "cycle",
      "order": 120
    }),

  field.number("cycle_travel_days", "Travel Days", {
      "labelKey": "hr.site-rotations.fields.cycle_travel_days",
      "hint": "Total hari perjalanan pulang-pergi. 2 = sehari keluar, sehari kembali. Angka ganjil condong ke sisi keluar (3 = 2 keluar, 1 kembali). Di luar hitungan Work Days maupun Off Days — blok kerja 42 hari tetap 42 hari. 0 = travel dianggap sudah termasuk blok kerja.",
      "default": 0,
      "tab": "cycle",
      "order": 125
    }),

  field.number("cycle_off_days", "Off Days", {
      "labelKey": "hr.site-rotations.fields.cycle_off_days",
      "hint": "Mis. 14 untuk pola 2 minggu off.",
      "tab": "cycle",
      "order": 130
    }),

  field.number("cycle_count", "Cycle Count", {
      "labelKey": "hr.site-rotations.fields.cycle_count",
      "hint": "Berapa putaran ON+OFF yang dibuat. Tidak perlu ditebak: panjang satu siklus = Work + Off + 2 × Travel, dan kolom Cycle Length di sebelah sudah menghitungnya. Contoh 42/14/2 → 60 hari, jadi setahun butuh 7. Untuk memperpanjang nanti pakai Extend Schedule — bukan menaikkan angka ini, karena itu membangun ulang seluruh dokumen. Maksimal 24.",
      "default": 4,
      "tab": "cycle",
      "order": 140
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "hr.site-rotations.fields.company",
      "disabled": true,
      "displayKey": "company_name",
      "hint": "Terisi otomatis dari penempatan pegawai.",
      "tab": "organization",
      "order": 210
    }),

  field.lookup("branch", "Branch", "/api/administration/organization/lookup/branches/", {
      "labelKey": "hr.site-rotations.fields.branch",
      "disabled": true,
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "branch_name",
      "tab": "organization",
      "order": 220
    }),

  field.lookup("location", "Site / Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "hr.site-rotations.fields.location",
      "disabled": true,
      "lookupParams": {
        "company_id": "$company",
        "branch_id": "$branch"
      },
      "displayKey": "location_name",
      "hint": "Lokasi kerja yang jadi tujuan travel in.",
      "tab": "organization",
      "order": 230
    }),

  field.text("department_name", "Department", {
      "labelKey": "hr.site-rotations.fields.department_name",
      "disabled": true,
      "readonly": true,
      "tab": "organization",
      "order": 240
    }),

  field.text("section_name", "Section", {
      "labelKey": "hr.site-rotations.fields.section_name",
      "disabled": true,
      "readonly": true,
      "tab": "organization",
      "order": 250
    }),

  field.text("position_name", "Job Title", {
      "labelKey": "hr.site-rotations.fields.position_name",
      "disabled": true,
      "readonly": true,
      "tab": "organization",
      "order": 260
    }),

  field.text("work_email", "Email Address", {
      "labelKey": "hr.site-rotations.fields.work_email",
      "disabled": true,
      "readonly": true,
      "hint": "Email kantor; kosong = dipakai email pribadi.",
      "tab": "organization",
      "order": 270
    }),

  field.text("phone_number", "Phone Number", {
      "labelKey": "hr.site-rotations.fields.phone_number",
      "disabled": true,
      "readonly": true,
      "tab": "organization",
      "order": 280
    }),

  field.date("join_date", "Date Of Hire", {
      "labelKey": "hr.site-rotations.fields.join_date",
      "disabled": true,
      "readonly": true,
      "tab": "organization",
      "order": 290
    }),

  field.text("point_of_hire_name", "Point Of Hire", {
      "labelKey": "hr.site-rotations.fields.point_of_hire_name",
      "disabled": true,
      "readonly": true,
      "hint": "Kota rekrut pegawai — tujuan tiket pulang tiap blok off. Diubah dari master Employee, bukan dari sini.",
      "tab": "organization",
      "order": 300
    }),

  field.textarea("notes", "Notes", {
      "labelKey": "hr.site-rotations.fields.notes",
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "notes",
      "order": 310
    }),
], {
  columns: 3,
})