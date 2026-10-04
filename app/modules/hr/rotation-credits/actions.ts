import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const rotationCreditsRecordActions: RecordAction[] = [
  {
    "key": "reverse",
    "label": "Reverse",
    "icon": "Undo2",
    "variant": "destructive",
    "placement": "secondary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/hr/rotation-credits/{id}/reverse/",
    "method": "post",
    "fields": [
      {
        "key": "reason",
        "type": "textarea",
        "label": "Alasan Pembalikan",
        "required": true
      }
    ],
    "confirm": {
      "title": "Batalkan transaksi ini?",
      "description": "Barisnya tidak dihapus — dicatat baris baru yang membatalkannya, dan keduanya tetap terbaca."
    },
    "refresh": true,
    "visibleWhen": {
      "all": [
        {
          "field": "entry_type",
          "op": "ne",
          "value": "reversal"
        },
        {
          "field": "reversed_by_label",
          "op": "is_null"
        }
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
export const rotationCreditsCollectionActions: CollectionAction[] = []
