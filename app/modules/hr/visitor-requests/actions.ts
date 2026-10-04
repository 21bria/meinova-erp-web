import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const visitorRequestsRecordActions: RecordAction[] = [
  {
    "key": "submit",
    "label": "Submit for Approval",
    "icon": "Send",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/visitor-requests/{id}/submit/",
    "method": "post",
    "confirm": {
      "title": "Ajukan Visitor Request?",
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
    "icon": "CheckCircle2",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/visitor-requests/{id}/approve/",
    "method": "post",
    "refresh": true,
    "visibleWhen": {
      "approval.can_act": true
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
    "endpoint": "/api/hr/visitor-requests/{id}/reject/",
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
      "approval.can_act": true
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
    "endpoint": "/api/hr/visitor-requests/{id}/withdraw/",
    "method": "post",
    "confirm": {
      "title": "Tarik kembali pengajuan?",
      "description": "Dokumen kembali ke Draft dan bisa disunting lagi. Jejak pengajuannya tetap tersimpan."
    },
    "refresh": true,
    "visibleWhen": {
      "status": [
        "submitted",
        "under_review"
      ]
    }
  },

  {
    "key": "check_in",
    "label": "Check In",
    "icon": "LogIn",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/visitor-requests/{id}/check-in/",
    "method": "post",
    "fields": [
      {
        "key": "gate",
        "type": "text",
        "label": "Gate / Security Post",
        "required": false
      },
      {
        "key": "remarks",
        "type": "textarea",
        "label": "Remarks",
        "required": false
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "all": [
        {
          "field": "status",
          "op": "eq",
          "value": "approved"
        },
        {
          "field": "checked_in_at",
          "op": "is_null"
        }
      ]
    }
  },

  {
    "key": "check_out",
    "label": "Check Out",
    "icon": "LogOut",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/visitor-requests/{id}/check-out/",
    "method": "post",
    "fields": [
      {
        "key": "remarks",
        "type": "textarea",
        "label": "Remarks",
        "required": false
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "all": [
        {
          "field": "checked_in_at",
          "op": "is_not_null"
        },
        {
          "field": "checked_out_at",
          "op": "is_null"
        }
      ]
    }
  },

  {
    "key": "issue_pass",
    "label": "Issue Visitor Pass",
    "icon": "IdCard",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/visitor-requests/{id}/issue-pass/",
    "method": "post",
    "refresh": true,
    "visibleWhen": {
      "status": [
        "approved",
        "completed"
      ]
    }
  },

  {
    "key": "no_show",
    "label": "Mark No Show",
    "icon": "UserX",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/visitor-requests/{id}/no-show/",
    "method": "post",
    "fields": [
      {
        "key": "remarks",
        "type": "textarea",
        "label": "Keterangan",
        "required": false
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "all": [
        {
          "field": "status",
          "op": "eq",
          "value": "approved"
        },
        {
          "field": "checked_in_at",
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
export const visitorRequestsCollectionActions: CollectionAction[] = []
