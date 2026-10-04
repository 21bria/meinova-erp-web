import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const siteRotationsRecordActions: RecordAction[] = [
  {
    "key": "generate_periods",
    "label": "Generate Periods",
    "icon": "CalendarSync",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/site-rotations/{id}/generate-periods/",
    "method": "post",
    "payload": {
      "force": false
    },
    "confirm": {
      "title": "Generate ulang periode?",
      "description": "Seluruh baris ON/OFF dokumen ini beserta baris travel-nya dibuat ulang dari pola siklus. Periode yang sudah disunting tangan atau punya travel yang diisi tangan akan menolak ditimpa — pakai Regenerate (Overwrite) kalau memang itu yang diinginkan."
    },
    "refresh": true
  },

  {
    "key": "extend_periods",
    "label": "Extend Schedule",
    "icon": "CalendarPlus",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/site-rotations/{id}/extend-periods/",
    "method": "post",
    "fields": [
      {
        "key": "cycles",
        "type": "integer",
        "label": "Add Cycles",
        "required": false,
        "help_text": "Berapa putaran ON+OFF disambung di ujung jadwal. Kosongkan kalau memakai tanggal di bawah."
      },
      {
        "key": "until",
        "type": "date",
        "label": "Extend Until",
        "required": false,
        "help_text": "Alternatif: sambung sampai tanggal ini. Jumlah siklusnya dihitung sendiri."
      }
    ],
    "refresh": true
  },

  {
    "key": "sync_shift_baseline",
    "label": "Generate Shift Baseline",
    "icon": "CalendarSync",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/site-rotations/{id}/sync-shift-baseline/",
    "method": "post",
    "confirm": {
      "title": "Susun ulang rencana shift dari policy?",
      "description": "Rencana shift disusun ulang mengikuti blok kerja dokumen ini dan urutan perputaran shift di Roster Policy. Penyesuaian (adjustment) tidak disentuh, dan tidak satu pun tanggal roster bergeser."
    },
    "refresh": true
  },

  {
    "key": "apply_shift_pattern",
    "label": "Set Shift Pattern (Manual)",
    "icon": "Clock",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/site-rotations/{id}/apply-shift-pattern/",
    "method": "post",
    "fields": [
      {
        "key": "shifts",
        "type": "multilookup",
        "label": "Shift Rotation",
        "required": true,
        "endpoint": "/api/administration/references/hr/lookup/shifts/",
        "label_key": "label",
        "value_key": "value",
        "placeholder": "Pilih shift…",
        "help_text": "Urutan pilihan = urutan perputaran. Satu shift saja berarti blok kerjanya memakai shift itu terus. Jamnya tetap milik master Shift."
      },
      {
        "key": "rotation_days",
        "type": "integer",
        "label": "Change Shift Every (days)",
        "required": false,
        "default": 7,
        "help_text": "7 = berganti tiap minggu. Dihitung dari awal blok kerja, jadi hasilnya sama berapa kali pun tombol ini ditekan."
      },
      {
        "key": "start",
        "type": "date",
        "label": "From",
        "required": false,
        "help_text": "Kosong = seluruh rentang jadwal dokumen ini."
      },
      {
        "key": "until",
        "type": "date",
        "label": "Until",
        "required": false,
        "help_text": "Kosong = sampai akhir horizon jadwal."
      }
    ],
    "confirm": {
      "title": "Susun rencana shift manual?",
      "description": "Rencana shift lama pada rentang ini digantikan pola yang dipilih. Penyesuaian (adjustment) tidak disentuh, dan tidak satu pun tanggal roster bergeser. Perhatikan: pola ini bertahan sampai rosternya berubah — sesudah itu rencana disusun ulang dari urutan perputaran di Roster Policy."
    },
    "refresh": true
  },

  {
    "key": "regenerate_from",
    "label": "Rebuild From Period",
    "icon": "CalendarCog",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/site-rotations/{id}/regenerate-from/",
    "method": "post",
    "fields": [
      {
        "key": "from_sequence",
        "type": "integer",
        "label": "From Period #",
        "required": true,
        "help_text": "Blok pertama yang dibuat ulang dengan pola yang berlaku sekarang. Blok sebelumnya tidak disentuh."
      },
      {
        "key": "cycles",
        "type": "integer",
        "label": "Cycles",
        "required": false,
        "help_text": "Kosongkan = sebanyak yang digantikan."
      }
    ],
    "confirm": {
      "title": "Bangun ulang dari periode ini?",
      "description": "Blok dari nomor yang disebut ke bawah dibuat ulang dengan pola sekarang. Blok sebelumnya, termasuk yang sudah disesuaikan, tidak disentuh."
    },
    "refresh": true
  },

  {
    "key": "shift_periods",
    "label": "Shift Schedule",
    "icon": "CalendarArrowDown",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/site-rotations/{id}/shift-periods/",
    "method": "post",
    "fields": [
      {
        "key": "from_sequence",
        "type": "integer",
        "label": "Dari Periode #",
        "required": true,
        "help_text": "Nomor urut periode pertama yang bergeser. Periode sebelumnya tidak disentuh."
      },
      {
        "key": "days",
        "type": "integer",
        "label": "Geser (hari)",
        "required": true,
        "help_text": "Positif memundurkan, negatif memajukan. Mis. -2 untuk kapal yang berangkat dua hari lebih cepat."
      }
    ],
    "confirm": {
      "title": "Geser sisa jadwal?",
      "description": "Periode yang dipilih dan seluruh periode sesudahnya bergeser, termasuk tanggal travel dan akomodasinya. Semuanya ditandai disunting tangan, jadi tidak akan ditimpa Generate Periods."
    },
    "refresh": true
  },

  {
    "key": "regenerate_periods_force",
    "label": "Regenerate (Overwrite)",
    "icon": "TriangleAlert",
    "variant": "destructive",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/site-rotations/{id}/generate-periods/",
    "method": "post",
    "payload": {
      "force": true
    },
    "confirm": {
      "title": "Timpa seluruh jadwal?",
      "description": "Termasuk periode yang sudah disunting tangan dan baris travel yang sudah berisi nomor tiket atau bookingan hotel. Semuanya dibuat ulang dari pola siklus dan isian manualnya hilang."
    },
    "refresh": true
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
export const siteRotationsCollectionActions: CollectionAction[] = []
