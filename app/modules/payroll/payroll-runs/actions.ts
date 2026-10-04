import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const payrollRunsRecordActions: RecordAction[] = [
  {
    "key": "generate_employees",
    "label": "Generate Employees",
    "icon": "UsersRound",
    "variant": "outline",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/payroll/payroll-runs/{id}/generate-employees/",
    "method": "post",
    "confirm": {
      "title": "Generate daftar pegawai?",
      "description": "Pegawai aktif yang memenuhi syarat pada periode ini ditarik ke run. Baris yang sudah ada tidak diduplikasi; yang tidak lagi memenuhi syarat ditandai Excluded, bukan dihapus."
    },
    "refresh": true,
    "visibleWhen": {
      "status": [
        "draft",
        "processing",
        "review",
        "rejected"
      ]
    }
  },

  {
    "key": "calculate",
    "label": "Calculate",
    "icon": "Calculator",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/payroll/payroll-runs/{id}/calculate/",
    "method": "post",
    "confirm": {
      "title": "Hitung ulang payroll?",
      "description": "Seluruh baris dihitung ulang dari master, absensi, cuti, lembur, dan payroll input yang sudah Confirmed. Rincian lama diganti."
    },
    "refresh": true,
    "visibleWhen": {
      "status": [
        "draft",
        "processing",
        "review",
        "rejected"
      ]
    }
  },

  {
    "key": "acknowledge",
    "label": "Acknowledge Warnings",
    "icon": "ShieldCheck",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/payroll/payroll-runs/{id}/acknowledge/",
    "method": "post",
    "confirm": {
      "title": "Akui seluruh peringatan?",
      "description": "Peringatan tidak menghalangi Finalize, tapi harus diakui dulu supaya tercatat siapa yang membacanya."
    },
    "refresh": true,
    "visibleWhen": {
      "status": [
        "review",
        "rejected"
      ]
    }
  },

  {
    "key": "submit",
    "label": "Submit for Approval",
    "icon": "Send",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/payroll/payroll-runs/{id}/submit/",
    "method": "post",
    "confirm": {
      "title": "Ajukan payroll run?",
      "description": "Dokumen dikirim ke alur persetujuan dan tidak bisa disunting sampai keputusannya keluar."
    },
    "refresh": true,
    "visibleWhen": {
      "status": [
        "review",
        "rejected"
      ]
    }
  },

  {
    "key": "withdraw",
    "label": "Withdraw",
    "icon": "Undo2",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/payroll/payroll-runs/{id}/withdraw/",
    "method": "post",
    "refresh": true,
    "visibleWhen": {
      "status": [
        "submitted"
      ]
    }
  },

  {
    "key": "finalize",
    "label": "Finalize & Issue Payslip",
    "icon": "Lock",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/payroll/payroll-runs/{id}/finalize/",
    "method": "post",
    "confirm": {
      "title": "Finalisasi payroll run?",
      "description": "Angkanya dibekukan, run dikunci, dan slip gaji terbit. Setelah ini perubahan master tidak lagi mengubah payroll periode ini, dan koreksi harus lewat run bertipe Correction."
    },
    "refresh": true,
    "visibleWhen": {
      "status": [
        "approved"
      ]
    }
  },

  {
    "key": "cancel_run",
    "label": "Cancel Run",
    "icon": "Ban",
    "variant": "destructive",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/payroll/payroll-runs/{id}/cancel/",
    "method": "post",
    "fields": [
      {
        "key": "notes",
        "type": "textarea",
        "label": "Alasan Pembatalan",
        "required": false
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "status": [
        "draft",
        "processing",
        "review",
        "rejected"
      ]
    }
  },
]

/*
 * Tombol yang berlaku untuk BANYAK baris sekaligus — Post All dan
 * sejenisnya. Tempatnya toolbar tabel, bukan di dalam baris: hanya di
 * sana yang tahu penyaring yang sedang aktif dan baris mana yang
 * dicentang.
 *
 * Digenerate dari `schema.actions` yang ber-`scope: "collection"`.
 */
export const payrollRunsCollectionActions: CollectionAction[] = []
