import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const employeeActionsRecordActions: RecordAction[] = [
  {
    "key": "submit",
    "label": "Submit",
    "icon": "Send",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/employee-actions/{id}/submit/",
    "method": "post",
    "refresh": true,
    "visibleWhen": {
      "status": [
        "draft",
        "rejected"
      ]
    }
  },

  {
    "key": "approve",
    "label": "Approve",
    "icon": "CheckCircle2",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/employee-actions/{id}/approve/",
    "method": "post",
    "confirm": {
      "title": "Setujui perubahan ini?",
      "description": "Kalau ini meja terakhir, perubahannya langsung diterapkan ke data pegawai dan tidak bisa ditarik kembali — yang bisa dilakukan sesudahnya cuma membuat action kebalikannya."
    },
    "refresh": true,
    "visibleWhen": {
      "status": "submitted"
    }
  },

  {
    "key": "reject",
    "label": "Reject",
    "icon": "XCircle",
    "variant": "destructive",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/employee-actions/{id}/reject/",
    "method": "post",
    "fields": [
      {
        "key": "notes",
        "type": "textarea",
        "label": "Alasan Penolakan",
        "required": true
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "status": "submitted"
    }
  },

  {
    "key": "withdraw",
    "label": "Withdraw",
    "icon": "RotateCcw",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/employee-actions/{id}/withdraw/",
    "method": "post",
    "confirm": true,
    "refresh": true,
    "visibleWhen": {
      "status": "submitted"
    }
  },

  {
    "key": "apply",
    "label": "Retry Apply",
    "icon": "RefreshCw",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/employee-actions/{id}/apply/",
    "method": "post",
    "confirm": {
      "title": "Terapkan ulang?",
      "description": "Dipakai kalau alurnya sudah selesai tapi penulisannya gagal. Dokumen yang perubahannya sudah masuk tidak akan diterapkan dua kali."
    },
    "refresh": true,
    "visibleWhen": {
      "status": "approved"
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
export const employeeActionsCollectionActions: CollectionAction[] = []
