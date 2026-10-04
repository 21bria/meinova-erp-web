import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const businessTripsRecordActions: RecordAction[] = [
  {
    "key": "submit",
    "label": "Submit for Approval",
    "i18nKey": "hr.business-trips.actions.submit",
    "icon": "Send",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/business-trips/{id}/submit/",
    "method": "post",
    "confirm": {
      "title": "Ajukan Business Trip?",
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
    "i18nKey": "hr.business-trips.actions.approve",
    "icon": "CheckCircle2",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/business-trips/{id}/approve/",
    "method": "post",
    "refresh": true,
    "visibleWhen": {
      "approval.can_act": true
    }
  },

  {
    "key": "reject",
    "label": "Reject",
    "i18nKey": "hr.business-trips.actions.reject",
    "icon": "XCircle",
    "variant": "destructive",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/business-trips/{id}/reject/",
    "method": "post",
    "fields": [
      {
        "key": "notes",
        "type": "textarea",
        "label": "Catatan",
        "required": true
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "approval.can_act": true
    }
  },

  {
    "key": "return",
    "label": "Return",
    "i18nKey": "hr.business-trips.actions.return",
    "icon": "Undo2",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/business-trips/{id}/return/",
    "method": "post",
    "fields": [
      {
        "key": "notes",
        "type": "textarea",
        "label": "Catatan",
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
    "i18nKey": "hr.business-trips.actions.withdraw",
    "icon": "RotateCcw",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/business-trips/{id}/withdraw/",
    "method": "post",
    "refresh": true,
    "visibleWhen": {
      "status": [
        "submitted"
      ]
    }
  },

  {
    "key": "depart",
    "label": "Mark Departed",
    "i18nKey": "hr.business-trips.actions.depart",
    "icon": "PlaneTakeoff",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/business-trips/{id}/depart/",
    "method": "post",
    "refresh": true,
    "visibleWhen": {
      "status": [
        "approved"
      ]
    }
  },

  {
    "key": "complete",
    "label": "Complete",
    "i18nKey": "hr.business-trips.actions.complete",
    "icon": "PlaneLanding",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/business-trips/{id}/complete/",
    "method": "post",
    "fields": [
      {
        "key": "actual_return_datetime",
        "type": "datetime",
        "label": "Actual Return",
        "required": true
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "status": [
        "approved",
        "on_trip"
      ]
    }
  },

  {
    "key": "cancel",
    "label": "Cancel",
    "i18nKey": "hr.business-trips.actions.cancel",
    "icon": "Ban",
    "variant": "destructive",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/business-trips/{id}/cancel/",
    "method": "post",
    "fields": [
      {
        "key": "cancellation_reason",
        "type": "textarea",
        "label": "Alasan Pembatalan",
        "required": true
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "status": [
        "approved",
        "on_trip"
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
export const businessTripsCollectionActions: CollectionAction[] = []
