import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const assignmentsRecordActions: RecordAction[] = [
  {
    "key": "submit",
    "label": "Submit",
    "i18nKey": "assets.assignments.actions.submit",
    "icon": "Send",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/assets/assignments/{id}/submit/",
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
    "i18nKey": "assets.assignments.actions.approve",
    "icon": "Check",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/assets/assignments/{id}/approve/",
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
    "i18nKey": "assets.assignments.actions.reject",
    "icon": "X",
    "variant": "destructive",
    "placement": "secondary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/assets/assignments/{id}/reject/",
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
    "label": "Complete Handover",
    "i18nKey": "assets.assignments.actions.complete",
    "icon": "PackageCheck",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/assets/assignments/{id}/complete/",
    "method": "post",
    "fields": [
      {
        "key": "handover_date",
        "type": "date",
        "label": "Handover Date",
        "required": false
      },
      {
        "key": "condition",
        "type": "select",
        "label": "Condition at Handover",
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
        "required": false,
        "help_text": "Diisi = dicatat ke riwayat kondisi (HANDOVER)."
      },
      {
        "key": "note",
        "type": "textarea",
        "label": "Note",
        "required": false
      }
    ],
    "confirm": {
      "title": "Selesaikan serah terima?",
      "description": "Custody aset berpindah dari penyimpanan ke penerima. Dokumen tidak bisa diubah lagi."
    },
    "refresh": true,
    "visibleWhen": {
      "can_complete": true
    }
  },

  {
    "key": "cancel",
    "label": "Cancel",
    "i18nKey": "assets.assignments.actions.cancel",
    "icon": "Ban",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/assets/assignments/{id}/cancel/",
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
export const assignmentsCollectionActions: CollectionAction[] = []
