import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const leaveRecordActions: RecordAction[] = [
  {
    "key": "submit",
    "label": "Submit",
    "icon": "Send",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/leaves/{id}/submit/",
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
    "endpoint": "/api/hr/leaves/{id}/approve/",
    "method": "post",
    "refresh": true,
    "visibleWhen": {
      "workflow.can_act": true
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
    "endpoint": "/api/hr/leaves/{id}/reject/",
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
      "workflow.can_act": true
    }
  },

  {
    "key": "return",
    "label": "Return to Requester",
    "icon": "Undo2",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/leaves/{id}/return/",
    "method": "post",
    "fields": [
      {
        "key": "notes",
        "type": "textarea",
        "label": "Yang Perlu Diperbaiki",
        "required": true
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "workflow.can_act": true
    }
  },

  {
    "key": "cancel",
    "label": "Cancel Record",
    "icon": "Ban",
    "variant": "destructive",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/leaves/{id}/cancel/",
    "method": "post",
    "refresh": true,
    "visibleWhen": {
      "status": "recorded"
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
    "endpoint": "/api/hr/leaves/{id}/withdraw/",
    "method": "post",
    "refresh": true,
    "visibleWhen": {
      "status": "submitted"
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
export const leaveCollectionActions: CollectionAction[] = []
