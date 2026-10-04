import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const transfersRecordActions: RecordAction[] = [
  {
    "key": "submit",
    "label": "Submit",
    "i18nKey": "assets.transfers.actions.submit",
    "icon": "Send",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/assets/transfers/{id}/submit/",
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
    "i18nKey": "assets.transfers.actions.approve",
    "icon": "Check",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/assets/transfers/{id}/approve/",
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
    "i18nKey": "assets.transfers.actions.reject",
    "icon": "X",
    "variant": "destructive",
    "placement": "secondary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/assets/transfers/{id}/reject/",
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
    "label": "Complete Transfer",
    "i18nKey": "assets.transfers.actions.complete",
    "icon": "PackageCheck",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/assets/transfers/{id}/complete/",
    "method": "post",
    "fields": [
      {
        "key": "transfer_date",
        "type": "date",
        "label": "Transfer Date",
        "required": false
      },
      {
        "key": "condition",
        "type": "select",
        "label": "Condition at Transfer",
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
        "help_text": "Wajib — dicatat ke riwayat kondisi (TRANSFER)."
      },
      {
        "key": "note",
        "type": "textarea",
        "label": "Note",
        "required": false
      }
    ],
    "confirm": {
      "title": "Selesaikan Transfer?",
      "description": "Custody aset berpindah ke tujuan. Dokumen tidak bisa diubah lagi."
    },
    "refresh": true,
    "visibleWhen": {
      "can_complete": true
    }
  },

  {
    "key": "cancel",
    "label": "Cancel",
    "i18nKey": "assets.transfers.actions.cancel",
    "icon": "Ban",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/assets/transfers/{id}/cancel/",
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
export const transfersCollectionActions: CollectionAction[] = []
