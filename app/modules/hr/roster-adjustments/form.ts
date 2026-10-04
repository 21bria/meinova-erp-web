import { createForm, field } from "@framework"

export const rosterAdjustmentsForm = createForm([
  field.text("document_number", "Document No.", {
      "labelKey": "hr.roster-adjustments.fields.document_number",
      "disabled": true,
      "modes": [
        "edit"
      ],
      "default": "",
      "tab": "general",
      "order": 5
    }),

  field.lookup("plan", "Roster Plan", "/api/hr/lookup/roster-plans/", {
      "labelKey": "hr.roster-adjustments.fields.plan",
      "required": true,
      "autofill": {
        "employee": "employee"
      },
      "displayKey": "plan_label",
      "hint": "Hanya jadwal yang sudah dibaselinekan. Yang masih draft cukup disunting langsung — tidak perlu dokumen.",
      "tab": "general",
      "order": 10
    }),

  field.text("plan_label", "Plan", {
      "labelKey": "hr.roster-adjustments.fields.plan_label",
      "readonly": true,
      "tab": "general",
      "order": 11
    }),

  field.text("employee_number", "Employee No.", {
      "labelKey": "hr.roster-adjustments.fields.employee_number",
      "readonly": true,
      "tab": "general",
      "order": 12
    }),

  field.lookup("employee", "Employee", "/api/hr/employees/lookup/", {
      "labelKey": "hr.roster-adjustments.fields.employee",
      "readonly": true,
      "displayKey": "employee_name",
      "hint": "Diambil dari rencananya.",
      "tab": "general",
      "order": 15
    }),

  field.select("adjustment_kind", "Adjustment Type", {
      "labelKey": "hr.roster-adjustments.fields.adjustment_kind",
      "required": true,
      "displayKey": "adjustment_kind_label",
      "hint": "Yang membedakan bukan berapa harinya, melainkan siapa penyebabnya — dan itu tidak bisa disimpulkan sistem dari selisih tanggal.",
      "multiple": false,
      "tab": "general",
      "order": 20,
      "options": [
        {
          "label": "Work Extension",
          "value": "work_extension"
        },
        {
          "label": "Early Return",
          "value": "early_return"
        },
        {
          "label": "Deferred Leave (KTT approved)",
          "value": "deferred_leave"
        },
        {
          "label": "Late Return (employee fault)",
          "value": "late_return"
        },
        {
          "label": "Deferred Leave (no approval)",
          "value": "loyalty"
        },
        {
          "label": "No Impact (beyond employee control)",
          "value": "no_impact"
        },
        {
          "label": "Schedule Shift",
          "value": "schedule_shift"
        },
        {
          "label": "Use Rotation Credit",
          "value": "credit_use"
        }
      ]
    }),

  field.date("effective_date", "Effective Date", {
      "labelKey": "hr.roster-adjustments.fields.effective_date",
      "required": true,
      "hint": "Perubahan berlaku dari tanggal ini ke depan. Jadwal sebelumnya tidak disentuh sama sekali.",
      "tab": "general",
      "order": 25
    }),

  field.number("days", "Days", {
      "labelKey": "hr.roster-adjustments.fields.days",
      "visibleWhen": {
        "field": "adjustment_kind",
        "op": "in",
        "value": [
          "work_extension",
          "early_return",
          "deferred_leave",
          "late_return",
          "schedule_shift",
          "credit_use"
        ]
      },
      "hint": "Selalu positif. Arahnya ditentukan jenis penyesuaian — Work Extension memperpanjang, Early Return memendekkan.",
      "default": 0,
      "tab": "change",
      "order": 30
    }),

  field.select("credit_impact", "Rotation Credit", {
      "labelKey": "hr.roster-adjustments.fields.credit_impact",
      "displayKey": "credit_impact_label",
      "visibleWhen": {
        "field": "adjustment_kind",
        "op": "in",
        "value": [
          "work_extension",
          "early_return",
          "deferred_leave",
          "late_return",
          "schedule_shift",
          "credit_use"
        ]
      },
      "hint": "Terisi otomatis dari jenis penyesuaian, tapi boleh diubah: kapal yang delay pun kadang layak diberi kompensasi, dan itu keputusan yang tidak bisa disimpulkan dari jenisnya.",
      "default": "none",
      "multiple": false,
      "tab": "change",
      "order": 40,
      "options": [
        {
          "label": "No Credit Impact",
          "value": "none"
        },
        {
          "label": "Earn Credit",
          "value": "earn"
        },
        {
          "label": "Use Credit",
          "value": "use"
        }
      ]
    }),

  field.number("credit_days", "Credit Days", {
      "labelKey": "hr.roster-adjustments.fields.credit_days",
      "visibleWhen": {
        "not": {
          "field": "credit_impact",
          "op": "eq",
          "value": "none"
        }
      },
      "readonlyWhen": {
        "field": "credit_impact",
        "op": "eq",
        "value": "earn"
      },
      "hint": "Untuk Earn dihitung dari rasio pola pegawai (56:14 = 4, 42:14 = 3) dan dibekukan ke dokumen — rasio yang diubah di master minggu depan tidak mengubah arti yang sudah disetujui.",
      "default": 0,
      "tab": "change",
      "order": 45
    }),

  field.textarea("reason", "Reason", {
      "labelKey": "hr.roster-adjustments.fields.reason",
      "required": true,
      "hint": "Wajib. Jadwal yang bergeser tanpa alasan tidak bisa dijelaskan ke siapa pun enam bulan lagi.",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 55
    }),

  field.text("reference", "Reference", {
      "labelKey": "hr.roster-adjustments.fields.reference",
      "hint": "Nomor TR, nomor tiket, atau nomor memo.",
      "default": "",
      "tab": "general",
      "order": 60
    }),

  field.textarea("apply_error", "Apply Error", {
      "labelKey": "hr.roster-adjustments.fields.apply_error",
      "readonly": true,
      "hint": "Kegagalan penerapan ditempel di sini, bukan cuma di log server. Perbaiki datanya lalu tekan Apply lagi.",
      "modes": [
        "edit"
      ],
      "default": "",
      "rows": 3,
      "layout": "full",
      "tab": "general",
      "order": 70
    }),

  field.datetime("applied_at", "Applied At", {
      "labelKey": "hr.roster-adjustments.fields.applied_at",
      "readonly": true,
      "tab": "general",
      "order": 75
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.roster-adjustments.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.date("new_cycle_start", "New cycle start", {
      "labelKey": "hr.roster-adjustments.fields.new_cycle_start",
      "hint": "Untuk kasus jangkar digeser, bukan blok diperpanjang. Dikosongkan = jangkar dihitung dari jadwal yang bertahan.",
      "tab": "general"
    }),
], {
  columns: 3,
})