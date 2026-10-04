import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const visitorPassesRecordActions: RecordAction[] = [
  {
    "key": "return_pass",
    "label": "Mark Returned",
    "icon": "Undo2",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/visitor-passes/{id}/return/",
    "method": "post",
    "confirm": {
      "title": "Tandai kartu sudah kembali?",
      "description": "Kartu tidak lagi terhitung sedang dipegang tamu."
    },
    "refresh": true,
    "visibleWhen": {
      "status": [
        "issued"
      ]
    }
  },

  {
    "key": "mark_lost",
    "label": "Report Lost",
    "icon": "TriangleAlert",
    "variant": "destructive",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/visitor-passes/{id}/lost/",
    "method": "post",
    "fields": [
      {
        "key": "notes",
        "type": "textarea",
        "label": "Keterangan",
        "required": true
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "status": [
        "issued"
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
export const visitorPassesCollectionActions: CollectionAction[] = []
