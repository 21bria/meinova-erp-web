import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const travelRequestsRecordActions: RecordAction[] = [
  {
    "key": "submit",
    "label": "Submit for Approval",
    "icon": "Send",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/travel-requests/{id}/submit/",
    "method": "post",
    "confirm": {
      "title": "Ajukan Travel Request?",
      "description": "Dokumen dikirim ke alur persetujuan dan tidak bisa disunting sampai keputusannya keluar."
    },
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
    "endpoint": "/api/hr/travel-requests/{id}/approve/",
    "method": "post",
    "refresh": true,
    "visibleWhen": {
      "approval.can_act": true
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
    "endpoint": "/api/hr/travel-requests/{id}/reject/",
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
      "approval.can_act": true
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
    "endpoint": "/api/hr/travel-requests/{id}/withdraw/",
    "method": "post",
    "confirm": {
      "title": "Tarik kembali pengajuan?",
      "description": "Dokumen kembali ke Draft dan bisa disunting lagi. Jejak pengajuannya tetap tersimpan."
    },
    "refresh": true,
    "visibleWhen": {
      "status": [
        "submitted"
      ]
    }
  },

  {
    "key": "cancel_request",
    "label": "Cancel Request",
    "icon": "Ban",
    "variant": "destructive",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/travel-requests/{id}/cancel/",
    "method": "post",
    "fields": [
      {
        "key": "notes",
        "type": "textarea",
        "label": "Alasan Pembatalan",
        "required": false
      }
    ],
    "confirm": {
      "title": "Batalkan Travel Request?",
      "description": "Dokumen ditutup berstatus Cancelled dan catatan cuti yang terbit darinya ikut dibatalkan — saldonya kembali. Nomor cutinya tetap tersimpan. Dokumen ini tidak bisa diajukan ulang; buat dokumen baru kalau perjalanannya jadi lagi."
    },
    "refresh": true,
    "visibleWhen": {
      "status": [
        "approved"
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
export const travelRequestsCollectionActions: CollectionAction[] = []
