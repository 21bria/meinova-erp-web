import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const rosterSetupsRecordActions: RecordAction[] = [
  {
    "key": "add_employees",
    "label": "Add Employees",
    "icon": "UserPlus",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/roster-setups/{id}/add-employees/",
    "method": "post",
    "fields": [
      {
        "key": "employee_ids",
        "type": "multilookup",
        "label": "Employees",
        "required": true,
        "endpoint": "/api/hr/roster-setups/{id}/candidates/",
        "label_key": "label",
        "value_key": "value",
        "disabled_key": "already_added",
        "placeholder": "Pilih pegawai…",
        "help_text": "Roster Policy dan Current Cycle Start diambil dari penempatan masing-masing, dan bisa dikoreksi per baris sesudahnya — justru di situ perbedaannya: satu batch, banyak jangkar."
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "status": [
        "draft",
        "rejected"
      ]
    }
  },

  {
    "key": "preview",
    "label": "Preview Schedule",
    "icon": "CalendarSearch",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/roster-setups/{id}/preview/",
    "method": "get",
    "refresh": false
  },

  {
    "key": "submit",
    "label": "Submit",
    "icon": "Send",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/roster-setups/{id}/submit/",
    "method": "post",
    "confirm": {
      "title": "Ajukan setup roster?",
      "description": "Seluruh baris diajukan sebagai satu dokumen. Setelah disetujui, jadwalnya langsung diterbitkan dan dikunci sebagai baseline."
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
    "key": "withdraw",
    "label": "Withdraw",
    "icon": "RotateCcw",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/roster-setups/{id}/withdraw/",
    "method": "post",
    "confirm": true,
    "refresh": true,
    "visibleWhen": {
      "status": [
        "submitted"
      ]
    }
  },

  {
    "key": "commit",
    "label": "Retry Commit",
    "icon": "RefreshCw",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/roster-setups/{id}/commit/",
    "method": "post",
    "confirm": {
      "title": "Terbitkan ulang baris yang gagal?",
      "description": "Baris yang sudah berhasil tidak diulang."
    },
    "refresh": true,
    "visibleWhen": {
      "status": [
        "approved",
        "partial"
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
export const rosterSetupsCollectionActions: CollectionAction[] = []
