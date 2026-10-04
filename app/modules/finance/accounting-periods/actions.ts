import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const accountingPeriodsRecordActions: RecordAction[] = [
  {
    "key": "period_open",
    "label": "Open",
    "icon": "LockOpen",
    "variant": "default",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/finance/accounting-periods/{id}/change-status/",
    "method": "post",
    "payload": {
      "status": "open"
    },
    "fields": [
      {
        "key": "reason",
        "type": "textarea",
        "label": "Reason",
        "required": false,
        "help_text": "Wajib diisi kalau periodenya sedang terkunci."
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "field": "allowed_transitions",
      "op": "contains",
      "value": "open"
    }
  },

  {
    "key": "period_soft_close",
    "label": "Soft Close",
    "icon": "CalendarMinus",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/finance/accounting-periods/{id}/change-status/",
    "method": "post",
    "payload": {
      "status": "soft_closed"
    },
    "confirm": {
      "title": "Tutup sementara periode ini?",
      "description": "Transaksi harian berhenti. Yang punya wewenang 'Post to soft-closed accounting period' masih bisa memposting jurnal penyesuaian."
    },
    "refresh": true,
    "visibleWhen": {
      "field": "allowed_transitions",
      "op": "contains",
      "value": "soft_closed"
    }
  },

  {
    "key": "period_close",
    "label": "Close",
    "icon": "CalendarX",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/finance/accounting-periods/{id}/change-status/",
    "method": "post",
    "payload": {
      "status": "closed"
    },
    "confirm": {
      "title": "Tutup periode ini?",
      "description": "Tidak ada jurnal yang bisa diposting ke periode ini sampai dibuka kembali."
    },
    "refresh": true,
    "visibleWhen": {
      "field": "allowed_transitions",
      "op": "contains",
      "value": "closed"
    }
  },

  {
    "key": "period_lock",
    "label": "Lock",
    "icon": "Lock",
    "variant": "destructive",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/finance/accounting-periods/{id}/change-status/",
    "method": "post",
    "payload": {
      "status": "locked"
    },
    "confirm": {
      "title": "Kunci periode ini?",
      "description": "Dipakai setelah periodenya diaudit atau dilaporkan ke luar. Membukanya kembali perlu wewenang tersendiri dan alasan tertulis."
    },
    "refresh": true,
    "visibleWhen": {
      "field": "allowed_transitions",
      "op": "contains",
      "value": "locked"
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
export const accountingPeriodsCollectionActions: CollectionAction[] = []
