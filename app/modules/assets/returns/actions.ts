import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const returnsRecordActions: RecordAction[] = [
  {
    "key": "submit",
    "label": "Submit",
    "i18nKey": "assets.returns.actions.submit",
    "icon": "Send",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/assets/returns/{id}/submit/",
    "method": "post",
    "fields": [
      {
        "key": "notes",
        "type": "textarea",
        "label": "Notes",
        "required": false
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "can_submit": true
    }
  },

  {
    "key": "approve",
    "label": "Approve",
    "i18nKey": "assets.returns.actions.approve",
    "icon": "Check",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/assets/returns/{id}/approve/",
    "method": "post",
    "fields": [
      {
        "key": "notes",
        "type": "textarea",
        "label": "Notes",
        "required": false
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "approval.can_act": true
    }
  },

  {
    "key": "reject",
    "label": "Reject",
    "i18nKey": "assets.returns.actions.reject",
    "icon": "X",
    "variant": "destructive",
    "placement": "secondary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/assets/returns/{id}/reject/",
    "method": "post",
    "fields": [
      {
        "key": "notes",
        "type": "textarea",
        "label": "Notes",
        "required": false
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "approval.can_act": true
    }
  },

  {
    "key": "complete",
    "label": "Receive Return",
    "i18nKey": "assets.returns.actions.complete",
    "icon": "PackageCheck",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/assets/returns/{id}/complete/",
    "method": "post",
    "fields": [
      {
        "key": "return_date",
        "type": "date",
        "label": "Return Date",
        "required": false
      },
      {
        "key": "condition",
        "type": "select",
        "label": "Condition at Return",
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
        "required": true,
        "help_text": "Wajib — dicatat ke riwayat kondisi (RETURN)."
      },
      {
        "key": "note",
        "type": "textarea",
        "label": "Note",
        "required": false
      }
    ],
    "confirm": {
      "title": "Terima pengembalian?",
      "description": "Custody aset kembali ke penyimpanan tujuan. Dokumen tidak bisa diubah lagi."
    },
    "refresh": true,
    "visibleWhen": {
      "can_complete": true
    }
  },

  {
    "key": "cancel",
    "label": "Cancel",
    "i18nKey": "assets.returns.actions.cancel",
    "icon": "Ban",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/assets/returns/{id}/cancel/",
    "method": "post",
    "fields": [
      {
        "key": "notes",
        "type": "textarea",
        "label": "Notes",
        "required": false
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "can_cancel": true
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
export const returnsCollectionActions: CollectionAction[] = []
