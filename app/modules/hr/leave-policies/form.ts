import { createForm, field } from "@framework"

export const leavePoliciesForm = createForm([
  field.text("code", "Code", {
      "labelKey": "hr.leave-policies.fields.code",
      "required": true,
      "tab": "general",
      "order": 10
    }),

  field.text("name", "Name", {
      "labelKey": "hr.leave-policies.fields.name",
      "required": true,
      "tab": "general",
      "order": 20
    }),

  field.lookup("leave_type", "Leave Type", "/api/administration/references/hr/lookup/leave-types/", {
      "labelKey": "hr.leave-policies.fields.leave_type",
      "required": true,
      "displayKey": "leave_type_name",
      "tab": "general",
      "order": 30
    }),

  field.lookup("company", "Company", "/api/administration/organization/lookup/companies/", {
      "labelKey": "hr.leave-policies.fields.company",
      "displayKey": "company_name",
      "hint": "Dikosongkan = berlaku untuk semua company. Aturan yang menyebut company mengalahkan yang global.",
      "tab": "general",
      "order": 40
    }),

  field.lookup("employee_group", "Employee Group", "/api/administration/references/hr/lookup/employee-groups/", {
      "labelKey": "hr.leave-policies.fields.employee_group",
      "displayKey": "employee_group_name",
      "hint": "Dikosongkan = berlaku untuk semua golongan. Diisi kalau pegawai site dan pegawai kantor punya jatah berbeda.",
      "tab": "general",
      "order": 50
    }),

  field.lookup("employment_type", "Employment Type", "/api/administration/references/hr/lookup/employment-types/", {
      "labelKey": "hr.leave-policies.fields.employment_type",
      "displayKey": "employment_type_name",
      "hint": "Dikosongkan = berlaku untuk semua status. Mis. PKWT dan PKWTT berbeda jatahnya.",
      "tab": "general",
      "order": 60
    }),

  field.switch("uses_balance", "Uses Balance", {
      "labelKey": "hr.leave-policies.fields.uses_balance",
      "hint": "Menyala: cuti punya jatah dan sisa, dan LeaveBalance terbit dari aturan ini — cuti tahunan. Mati: haknya per kejadian (menikah, melahirkan, duka) — cutinya tetap dicatat tapi tidak ada saldo yang dipotong, dan yang berlaku adalah batas di tab Event Rules.",
      "default": true,
      "tab": "general",
      "order": 65
    }),

  field.textarea("description", "Description", {
      "labelKey": "hr.leave-policies.fields.description",
      "default": "",
      "rows": 2,
      "layout": "full",
      "tab": "general",
      "order": 70
    }),

  field.switch("is_active", "Is active", {
      "labelKey": "hr.leave-policies.fields.is_active",
      "default": true,
      "tab": "general"
    }),

  field.number("entitlement_days", "Entitlement per Period (days)", {
      "labelKey": "hr.leave-policies.fields.entitlement_days",
      "required": true,
      "visibleWhen": {
        "field": "uses_balance",
        "op": "is_true"
      },
      "hint": "Mis. 12 hari setahun.",
      "default": 12,
      "tab": "rule",
      "order": 110
    }),

  field.number("eligible_after_months", "Waiting Period (months)", {
      "labelKey": "hr.leave-policies.fields.eligible_after_months",
      "visibleWhen": {
        "field": "uses_balance",
        "op": "is_true"
      },
      "hint": "Dihitung sejak Join Date. 12 = cuti tahunan baru terbit setelah setahun bekerja. 0 = berlaku sejak hari pertama.",
      "default": 12,
      "tab": "rule",
      "order": 120
    }),

  field.switch("prorate_first_period", "Prorate First Period", {
      "labelKey": "hr.leave-policies.fields.prorate_first_period",
      "visibleWhen": {
        "field": "uses_balance",
        "op": "is_true"
      },
      "hint": "Menyala: pegawai yang mulai berhak bulan Agustus dapat 5/12 jatah untuk tahun itu. Mati: langsung penuh.",
      "default": true,
      "tab": "rule",
      "order": 130
    }),

  field.select("accrual", "Accrual", {
      "labelKey": "hr.leave-policies.fields.accrual",
      "visibleWhen": {
        "field": "uses_balance",
        "op": "is_true"
      },
      "default": "upfront",
      "multiple": false,
      "tab": "rule",
      "order": 140,
      "options": [
        {
          "label": "Upfront",
          "value": "upfront"
        },
        {
          "label": "Monthly Accrual",
          "value": "monthly"
        }
      ]
    }),

  field.select("period_basis", "Period Basis", {
      "labelKey": "hr.leave-policies.fields.period_basis",
      "visibleWhen": {
        "field": "uses_balance",
        "op": "is_true"
      },
      "hint": "Tahun Kalender = 1 Jan–31 Des untuk semua orang. Ulang Tahun Masa Kerja = mengikuti tanggal masuk masing-masing.",
      "default": "calendar",
      "multiple": false,
      "tab": "rule",
      "order": 150,
      "options": [
        {
          "label": "Calendar Year",
          "value": "calendar"
        },
        {
          "label": "Employment Anniversary",
          "value": "join_date"
        }
      ]
    }),

  field.switch("allow_carry_over", "Allow Carry Over", {
      "labelKey": "hr.leave-policies.fields.allow_carry_over",
      "visibleWhen": {
        "field": "uses_balance",
        "op": "is_true"
      },
      "default": false,
      "tab": "carry_over",
      "order": 210
    }),

  field.number("carry_over_max_days", "Carry Over Limit (days)", {
      "labelKey": "hr.leave-policies.fields.carry_over_max_days",
      "visibleWhen": {
        "field": "uses_balance",
        "op": "is_true"
      },
      "hint": "Dikosongkan = tanpa batas. Hanya berlaku kalau saklar di atas menyala.",
      "tab": "carry_over",
      "order": 220
    }),

  field.number("carry_over_expiry_months", "Expires After (months)", {
      "labelKey": "hr.leave-policies.fields.carry_over_expiry_months",
      "visibleWhen": {
        "field": "uses_balance",
        "op": "is_true"
      },
      "hint": "Sisa bawaan hangus setelah sekian bulan periode baru berjalan. Dikosongkan = tidak hangus. Dihitung dari 1 Januari tahun bawaannya, bukan dari tanggal perintah carry over dijalankan.",
      "tab": "carry_over",
      "order": 230
    }),

  field.text("carry_over_reminder_days", "Reminder Days Before Expiry", {
      "labelKey": "hr.leave-policies.fields.carry_over_reminder_days",
      "visibleWhen": {
        "all": [
          {
            "field": "uses_balance",
            "op": "is_true"
          },
          {
            "field": "allow_carry_over",
            "op": "is_true"
          }
        ]
      },
      "hint": "Sisa hari saat pegawai diingatkan cuti bawaannya akan hangus, dipisah koma — mis. 30,14,7. Dikosongkan = tidak ada pengingat.",
      "default": "30,14,7",
      "tab": "carry_over",
      "order": 240
    }),

  field.number("max_days", "Maximum Days", {
      "labelKey": "hr.leave-policies.fields.max_days",
      "visibleWhen": {
        "not": {
          "field": "uses_balance",
          "op": "is_true"
        }
      },
      "hint": "Batas hari untuk satu pengajuan. Dikosongkan = tanpa batas — dipakai cuti yang lamanya ditentukan surat dokter atau jadwal resmi (sakit, melahirkan, haji), bukan oleh perusahaan. Dibandingkan dengan jumlah hari yang tertulis di dokumennya, yaitu hari kerja yang hilang.",
      "tab": "event",
      "order": 310
    }),

  field.switch("per_event", "Per Event", {
      "labelKey": "hr.leave-policies.fields.per_event",
      "visibleWhen": {
        "not": {
          "field": "uses_balance",
          "op": "is_true"
        }
      },
      "hint": "Menyala: hak melekat pada kejadian, jadi riwayat diperiksa seumur bekerja — kelahiran anak kedua berhak penuh lagi. Mati: riwayat yang diperiksa hanya tahun yang sama, mis. cuti sakit.",
      "default": false,
      "tab": "event",
      "order": 320
    }),

  field.switch("document_required", "Document Required", {
      "labelKey": "hr.leave-policies.fields.document_required",
      "visibleWhen": {
        "not": {
          "field": "uses_balance",
          "op": "is_true"
        }
      },
      "hint": "Pengajuan wajib melampirkan dokumen pendukung. Diperiksa saat Submit, bukan saat draft disimpan — surat dokter lazim baru ada sesudah orangnya pulang berobat.",
      "default": false,
      "tab": "event",
      "order": 330
    }),

  field.switch("history_check", "History Check", {
      "labelKey": "hr.leave-policies.fields.history_check",
      "visibleWhen": {
        "not": {
          "field": "uses_balance",
          "op": "is_true"
        }
      },
      "hint": "Menampilkan riwayat pemakaian jenis cuti ini saat pengajuan dibuat, dan riwayat itu ikut terbaca approver sampai meja terakhir.",
      "default": false,
      "tab": "event",
      "order": 340
    }),

  field.select("history_action", "History Action", {
      "labelKey": "hr.leave-policies.fields.history_action",
      "visibleWhen": {
        "not": {
          "field": "uses_balance",
          "op": "is_true"
        }
      },
      "hint": "Warning = ditampilkan saja. Warning + Review = ikut menandai dokumennya sebagai perlu diperiksa. Block = pengajuannya ditolak — pakai hanya untuk hak yang memang sekali seumur bekerja, karena orang bisa menikahkan anak keduanya dan bisa berduka dua kali dalam setahun.",
      "default": "none",
      "multiple": false,
      "tab": "event",
      "order": 350,
      "options": [
        {
          "label": "None",
          "value": "none"
        },
        {
          "label": "Warning",
          "value": "warn"
        },
        {
          "label": "Warning + Review",
          "value": "review"
        },
        {
          "label": "Block",
          "value": "block"
        }
      ]
    }),
], {
  columns: 2,
})