import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const rosterAdjustmentsRecordActions: RecordAction[] = [
  {
    "key": "preview",
    "label": "Preview Impact",
    "icon": "CalendarSearch",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/roster-adjustments/{id}/preview/",
    "method": "get",
    "refresh": false
  },

  {
    "key": "submit",
    "label": "Submit",
    "icon": "Send",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/roster-adjustments/{id}/submit/",
    "method": "post",
    "confirm": {
      "title": "Ajukan penyesuaian?",
      "description": "Dokumen dikirim ke alur persetujuan. Jadwalnya baru berubah setelah seluruh meja menyetujui."
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
    "key": "withdraw",
    "label": "Withdraw",
    "icon": "RotateCcw",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/roster-adjustments/{id}/withdraw/",
    "method": "post",
    "confirm": true,
    "refresh": true,
    "visibleWhen": {
      "status": [
        "submitted"
      ]
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
    "endpoint": "/api/hr/roster-adjustments/{id}/apply/",
    "method": "post",
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
export const rosterAdjustmentsCollectionActions: CollectionAction[] = []
