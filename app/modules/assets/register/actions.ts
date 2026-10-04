import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const registerRecordActions: RecordAction[] = [
  {
    "key": "activate",
    "label": "Activate",
    "i18nKey": "assets.register.actions.activate",
    "icon": "CheckCircle",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/assets/assets/{id}/activate/",
    "method": "post",
    "confirm": {
      "title": "Aktifkan aset ini?",
      "description": "Aset masuk custody STORAGE di lokasinya. Sesudah aktif, lokasi hanya berpindah lewat dokumen custody dan aset tidak bisa dihapus."
    },
    "refresh": true,
    "visibleWhen": {
      "can_activate": true
    }
  },

  {
    "key": "record_condition",
    "label": "Record Condition",
    "i18nKey": "assets.register.actions.record_condition",
    "icon": "ClipboardCheck",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/assets/assets/{id}/record-condition/",
    "method": "post",
    "fields": [
      {
        "key": "condition",
        "type": "select",
        "label": "Condition",
        "options": [
          {
            "label": "Good",
            "value": "GOOD"
          },
          {
            "label": "Fair",
            "value": "FAIR"
          },
          {
            "label": "Damaged",
            "value": "DAMAGED"
          },
          {
            "label": "Unserviceable",
            "value": "UNSERVICEABLE"
          }
        ],
        "required": true
      },
      {
        "key": "note",
        "type": "textarea",
        "label": "Note",
        "required": false
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "can_record_condition": true
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
export const registerCollectionActions: CollectionAction[] = []
