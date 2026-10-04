import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const attendancePermissionsRecordActions: RecordAction[] = [
  {
    "key": "submit",
    "label": "Submit for Approval",
    "icon": "Send",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/attendance-permissions/{id}/submit/",
    "method": "post",
    "confirm": {
      "title": "Ajukan izin kehadiran?",
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
    "endpoint": "/api/hr/attendance-permissions/{id}/approve/",
    "method": "post",
    "confirm": {
      "title": "Setujui izin ini?",
      "description": "Presensi pada tanggal tersebut langsung dihitung ulang. Jam tap-nya tidak berubah — yang berubah klasifikasinya."
    },
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
    "endpoint": "/api/hr/attendance-permissions/{id}/reject/",
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
    "key": "cancel",
    "label": "Cancel",
    "icon": "RotateCcw",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/attendance-permissions/{id}/cancel/",
    "method": "post",
    "fields": [
      {
        "key": "notes",
        "type": "textarea",
        "label": "Alasan Pembatalan",
        "required": false
      }
    ],
    "confirm": {
      "title": "Batalkan izin ini?",
      "description": "Izin yang sudah disetujui berhenti berlaku dan presensinya dihitung ulang tanpa pembebasan. Yang belum disetujui kembali ke Draft."
    },
    "refresh": true,
    "visibleWhen": {
      "status": [
        "submitted",
        "in_review",
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
export const attendancePermissionsCollectionActions: CollectionAction[] = []
