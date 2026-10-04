import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const attendanceRecordActions: RecordAction[] = [
  {
    "key": "waive",
    "label": "Waive",
    "icon": "ShieldCheck",
    "variant": "outline",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/attendance/{id}/waive/",
    "method": "post",
    "fields": [
      {
        "key": "reason",
        "type": "textarea",
        "label": "Alasan Pembebasan",
        "required": true,
        "help_text": "Wajib. Pembebasan tanpa alasan tertulis membuat aturan ini kehilangan wibawanya dalam tiga bulan."
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "leave_obligation_status": [
        "outstanding"
      ]
    }
  },

  {
    "key": "require_leave",
    "label": "Require Leave",
    "icon": "CalendarClock",
    "variant": "outline",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/attendance/{id}/require-leave/",
    "method": "post",
    "fields": [
      {
        "key": "notes",
        "type": "textarea",
        "label": "Catatan Peninjauan",
        "required": false,
        "help_text": "Ikut terkirim ke pegawainya bersama permintaan mengajukan cuti."
      },
      {
        "key": "days",
        "type": "decimal",
        "label": "Hari Cuti (opsional)",
        "required": false,
        "help_text": "Kosongkan untuk memakai angka menurut aturan."
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "leave_obligation_status": [
        "outstanding",
        "waived"
      ]
    }
  },

  {
    "key": "issue_leave",
    "label": "Issue Leave",
    "icon": "FilePlus2",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/attendance/{id}/issue-leave/",
    "method": "post",
    "confirm": {
      "title": "Terbitkan dokumen cuti?",
      "description": "Dokumen cuti dibuat sebagai draft untuk tanggal ini. Saldo baru berkurang setelah cutinya disetujui."
    },
    "refresh": true,
    "visibleWhen": {
      "leave_obligation_status": [
        "outstanding"
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
export const attendanceCollectionActions: CollectionAction[] = []
