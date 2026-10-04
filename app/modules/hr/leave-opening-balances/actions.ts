import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const leaveOpeningBalancesRecordActions: RecordAction[] = [
  {
    "key": "post",
    "label": "Post",
    "icon": "CheckCircle2",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/leave-opening-balances/{id}/post/",
    "method": "post",
    "confirm": {
      "title": "Post saldo awal?",
      "description": "Angka ini akan jadi saldo cuti pegawainya dan bisa langsung dipakai mengajukan cuti."
    },
    "refresh": true,
    "visibleWhen": {
      "status": [
        "draft"
      ]
    },
    "permission": "hr.change_leaveopeningbalance"
  },

  {
    "key": "unpost",
    "label": "Unpost",
    "icon": "Undo2",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/hr/leave-opening-balances/{id}/unpost/",
    "method": "post",
    "confirm": {
      "title": "Tarik saldo awal?",
      "description": "Angkanya keluar dari kartu cuti pegawainya. Cuti yang sudah diambil tetap tercatat, jadi saldonya bisa jadi minus sampai angka penggantinya di-post."
    },
    "refresh": true,
    "visibleWhen": {
      "status": [
        "posted"
      ]
    },
    "permission": "hr.change_leaveopeningbalance"
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
export const leaveOpeningBalancesCollectionActions: CollectionAction[] = [
  {
    "key": "post_all",
    "label": "Post Saldo Awal",
    "icon": "CheckCircle2",
    "variant": "default",
    "endpoint": "/api/hr/leave-opening-balances/post-all/",
    "method": "post",
    "selection": "optional",
    "idsField": "ids",
    "confirm": {
      "title": "Post saldo awal?",
      "description": "Angkanya jadi saldo cuti pegawainya dan bisa langsung dipakai mengajukan cuti. Baris yang gagal dilaporkan satu per satu dan tidak membatalkan yang berhasil. Periksa dulu kolom Validation — yang bertanda REVIEW sebaiknya dibereskan sebelum di-post."
    },
    "permission": "hr.change_leaveopeningbalance"
  },
]
