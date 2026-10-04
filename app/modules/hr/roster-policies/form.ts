import { createForm, field } from "@framework"

export const rosterPoliciesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "hr.roster-policies.fields.code",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "hr.roster-policies.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "hr.roster-policies.fields.company",
      "displayKey": "company_name",
      "hint": "Dikosongkan = berlaku untuk semua company yang tidak punya aturannya sendiri.",
      "tab": "general",
      "order": 30
    }),

  field.lookup("location", "Site / Location", "/api/administration/organization/lookup/locations/", {
      "labelKey": "hr.roster-policies.fields.location",
      "lookupParams": {
        "company_id": "$company"
      },
      "displayKey": "location_name",
      "hint": "Site yang diatur. Dikosongkan = berlaku untuk semua site di company itu.",
      "tab": "general",
      "order": 40
    }),

  field.switch("is_default", "Default For This Site", {
      "labelKey": "hr.roster-policies.fields.is_default",
      "hint": "Aturan bawaan site: dipakai untuk pegawai yang belum ditugaskan Roster Policy, dan jadi pilihan awal di form. Hanya boleh satu per site.",
      "default": false,
      "tab": "general",
      "order": 50
    }),

  field.textarea("description", "Description", {
      "labelKey": "hr.roster-policies.fields.description",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 60
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.roster-policies.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.number("cycle_work_days", "Work Days", {
      "labelKey": "hr.roster-policies.fields.cycle_work_days",
      "hint": "Panjang blok kerja: 42 untuk pola 6:2, 56 untuk 8:2. Dikosongkan = aturan site saja — policy ini tidak bisa ditugaskan ke pegawai.",
      "tab": "cycle",
      "order": 110
    }),

  field.number("cycle_off_days", "Field Break Days", {
      "labelKey": "hr.roster-policies.fields.cycle_off_days",
      "hint": "Panjang blok off: 14 untuk 2 minggu.",
      "tab": "cycle",
      "order": 120
    }),

  field.select("roster_start_basis", "Cycle Start Basis", {
      "labelKey": "hr.roster-policies.fields.roster_start_basis",
      "required": true,
      "hint": "Arti tanggal Current Cycle Start pegawai. Work Start = hari pertama masuk kerja. Site Arrival = hari tiba di site (perjalanan menuju site sudah dihitung On Site). Travel Departure = hari berangkat dari Point of Hire.",
      "default": "work_start",
      "multiple": false,
      "tab": "cycle",
      "order": 130,
      "options": [
        {
          "value": "work_start",
          "label": "Work Start Date"
        },
        {
          "value": "site_arrival",
          "label": "Site Arrival Date"
        },
        {
          "value": "travel_departure",
          "label": "Travel Departure Date"
        }
      ]
    }),

  field.number("rolling_horizon_months", "Rolling Horizon (months)", {
      "labelKey": "hr.roster-policies.fields.rolling_horizon_months",
      "hint": "Jadwal digenerate sampai sekian bulan ke depan, lalu diperpanjang berkala tanpa menyentuh baris lama.",
      "default": 12,
      "tab": "cycle",
      "order": 140
    }),

  field.number("cycle_length", "Cycle Length (days)", {
      "labelKey": "hr.roster-policies.fields.cycle_length",
      "readonly": true,
      "hint": "Work + Field Break + Travel Out + Travel In.",
      "tab": "cycle",
      "order": 150
    }),

  field.number("derived_ratio", "Work : Off Ratio", {
      "labelKey": "hr.roster-policies.fields.derived_ratio",
      "readonly": true,
      "hint": "Dihitung dari pola di atas. Dipakai mengonversi kelebihan hari kerja jadi rotation credit.",
      "tab": "cycle",
      "order": 160
    }),

  field.number("min_rest_hours", "Minimum Rest (hours)", {
      "labelKey": "hr.roster-policies.fields.min_rest_hours",
      "hint": "Jeda minimum saat shift berganti, diukur dari jam selesai shift terakhir sampai jam mulai shift berikutnya. Kurang dari ini, jadwal disela hari Recovery sampai terpenuhi — roster dan blok kerjanya tidak digeser. 0 = tidak diperiksa. Contoh: 24 membuat Night 19:00–07:00 tidak bisa langsung disusul Day 07:00 keesokan harinya.",
      "default": 0,
      "tab": "cycle",
      "order": 170
    }),

  field.number("default_travel_out_days", "Default Travel Out (days)", {
      "labelKey": "hr.roster-policies.fields.default_travel_out_days",
      "required": true,
      "hint": "Site → Point of Hire. Dipakai untuk POH yang belum didaftarkan di tab Travel Days by POH.",
      "default": 1,
      "tab": "travel",
      "order": 210
    }),

  field.number("default_travel_in_days", "Default Travel In (days)", {
      "labelKey": "hr.roster-policies.fields.default_travel_in_days",
      "required": true,
      "hint": "Point of Hire → site.",
      "default": 1,
      "tab": "travel",
      "order": 220
    }),

  field.select("travel_day_mode", "Travel Day Mode", {
      "labelKey": "hr.roster-policies.fields.travel_day_mode",
      "required": true,
      "hint": "Rencana selalu memakai angka di atas. Actual Itinerary menyalakan langkah kedua: setelah Travel Request disetujui, selisihnya dilaporkan sebagai usulan penyesuaian — bukan diterapkan sendiri.",
      "default": "fixed",
      "multiple": false,
      "tab": "travel",
      "order": 230,
      "options": [
        {
          "value": "fixed",
          "label": "Fixed (from policy)"
        },
        {
          "value": "actual",
          "label": "Actual Itinerary"
        }
      ]
    }),

  field.switch("travel_creates_segment", "Create Travel Segments", {
      "labelKey": "hr.roster-policies.fields.travel_creates_segment",
      "hint": "Membuat baris Travel Out / Travel In di jadwal. Dimatikan = hari perjalanan cuma jadi celah kalender.",
      "default": true,
      "tab": "travel",
      "order": 240
    }),

  field.switch("travel_out_counts_as_roster_day", "Travel Out Counts As On-Site", {
      "labelKey": "hr.roster-policies.fields.travel_out_counts_as_roster_day",
      "hint": "Hari perjalanan pulang dihitung sebagai hari on-site di rekap. TIDAK memendekkan blok kerja — pegawai 45/14 yang dua hari di kapal tetap menjalani 45 hari di site.",
      "default": false,
      "tab": "travel",
      "order": 250
    }),

  field.switch("travel_in_counts_as_roster_day", "Travel In Counts As On-Site", {
      "labelKey": "hr.roster-policies.fields.travel_in_counts_as_roster_day",
      "hint": "Menyalakan aturan #4 dokumen Substansi Roster: perjalanan Sorong/Ternate → site sudah dihitung On Site.",
      "default": false,
      "tab": "travel",
      "order": 260
    }),

  field.switch("count_transit_overnight", "Count Transit Overnight", {
      "labelKey": "hr.roster-policies.fields.count_transit_overnight",
      "hint": "Malam menginap di kota transit ikut dihitung saat membandingkan rencana dengan itinerary nyata.",
      "default": true,
      "tab": "travel",
      "order": 270
    }),

  field.switch("travel_variance_credit_eligible", "Travel Variance Earns Credit", {
      "labelKey": "hr.roster-policies.fields.travel_variance_credit_eligible",
      "hint": "Bawaannya MATI: pesawat cancel di luar kendali pegawai, dan yang di luar kendali tidak menghasilkan hak tambahan. Nyalakan hanya kalau perusahaan memang memutuskan sebaliknya.",
      "default": false,
      "tab": "travel",
      "order": 280
    }),

  field.number("travel_variance_credit_max_days", "Variance Credit Max (days)", {
      "labelKey": "hr.roster-policies.fields.travel_variance_credit_max_days",
      "visibleWhen": {
        "field": "travel_variance_credit_eligible",
        "op": "is_true"
      },
      "hint": "0 = tanpa batas.",
      "default": 0,
      "tab": "travel",
      "order": 290
    }),

  field.switch("credit_enabled", "Enable Rotation Credit", {
      "labelKey": "hr.roster-policies.fields.credit_enabled",
      "hint": "Dimatikan = kelebihan hari kerja tidak menghasilkan saldo apa pun, dan menu Rotation Credit tidak berlaku untuk site ini.",
      "default": false,
      "tab": "credit",
      "order": 310
    }),

  field.number("conversion_ratio", "Conversion Ratio (override)", {
      "labelKey": "hr.roster-policies.fields.conversion_ratio",
      "visibleWhen": {
        "field": "credit_enabled",
        "op": "is_true"
      },
      "hint": "Dikosongkan = dihitung sendiri dari pola siklus di tab Cycle Pattern. Diisi hanya kalau perusahaan memakai angka yang berbeda dari polanya.",
      "tab": "credit",
      "order": 320
    }),

  field.select("credit_rounding", "Rounding", {
      "labelKey": "hr.roster-policies.fields.credit_rounding",
      "visibleWhen": {
        "field": "credit_enabled",
        "op": "is_true"
      },
      "hint": "Round Down + Carry Remainder adalah pilihan yang paling bisa dijelaskan ke pegawai: 7 hari lebih dengan rasio 3 = 2 kredit, sisa 1 hari dibawa ke perhitungan berikutnya.",
      "default": "floor",
      "multiple": false,
      "tab": "credit",
      "order": 330,
      "options": [
        {
          "value": "floor",
          "label": "Round Down"
        },
        {
          "value": "half_up",
          "label": "Round Half Up"
        },
        {
          "value": "ceil",
          "label": "Round Up"
        },
        {
          "value": "exact",
          "label": "Exact (no rounding)"
        }
      ]
    }),

  field.switch("credit_carry_remainder", "Carry Remainder", {
      "labelKey": "hr.roster-policies.fields.credit_carry_remainder",
      "visibleWhen": {
        "all": [
          {
            "field": "credit_enabled",
            "op": "is_true"
          },
          {
            "field": "credit_rounding",
            "op": "eq",
            "value": "floor"
          }
        ]
      },
      "hint": "Sisa hari yang belum genap jadi satu kredit disimpan, bukan hangus.",
      "default": true,
      "tab": "credit",
      "order": 340
    }),

  field.number("credit_max_balance_days", "Max Balance (days)", {
      "labelKey": "hr.roster-policies.fields.credit_max_balance_days",
      "visibleWhen": {
        "field": "credit_enabled",
        "op": "is_true"
      },
      "hint": "Dikosongkan = tanpa plafon.",
      "tab": "credit",
      "order": 350
    }),

  field.number("credit_expiry_months", "Expiry (months)", {
      "labelKey": "hr.roster-policies.fields.credit_expiry_months",
      "visibleWhen": {
        "field": "credit_enabled",
        "op": "is_true"
      },
      "hint": "Dikosongkan = tidak kedaluwarsa. Penjadwal kedaluwarsanya belum ada, jadi kolom ini belum berpengaruh.",
      "tab": "credit",
      "order": 360
    }),

  field.switch("credit_allow_negative", "Allow Negative Balance", {
      "labelKey": "hr.roster-policies.fields.credit_allow_negative",
      "visibleWhen": {
        "field": "credit_enabled",
        "op": "is_true"
      },
      "hint": "Saldo boleh menembus nol.",
      "default": false,
      "tab": "credit",
      "order": 370
    }),

  field.number("request_lead_days", "Request Lead Time (days)", {
      "labelKey": "hr.roster-policies.fields.request_lead_days",
      "hint": "Travel Request diajukan minimal sekian hari sebelum berangkat. 0 = tanpa tenggat.",
      "default": 7,
      "tab": "request",
      "order": 410
    }),

  field.number("notify_lead_days", "Notify Lead Time (days)", {
      "labelKey": "hr.roster-policies.fields.notify_lead_days",
      "hint": "Sistem mengingatkan sekian hari sebelum berangkat kalau Travel Request-nya belum dibuat. Butuh Celery Beat aktif.",
      "default": 7,
      "tab": "request",
      "order": 420
    }),

  field.lookup("urgent_purposes", "Urgent Purposes", "/api/administration/references/hr/lookup/rotation-purposes/", {
      "labelKey": "hr.roster-policies.fields.urgent_purposes",
      "hint": "Travel Purpose yang boleh menembus tenggat: duka, sakit, dinas, penyesuaian roster karena ada pengganti.",
      "multiple": true,
      "tab": "request",
      "order": 430
    }),
], {
  columns: 3,
})