import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const journalsRecordActions: RecordAction[] = [
  {
    "key": "submit",
    "label": "Submit",
    "icon": "Send",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/finance/journals/{id}/submit/",
    "method": "post",
    "confirm": {
      "title": "Ajukan jurnal ini?",
      "description": "Isinya terkunci selama menunggu persetujuan. Kalau tidak ada alur persetujuan yang dikonfigurasi, jurnal langsung berstatus Approved dan siap diposting."
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
    "endpoint": "/api/finance/journals/{id}/withdraw/",
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
    "key": "post",
    "label": "Post",
    "icon": "BookCheck",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/finance/journals/{id}/post/",
    "method": "post",
    "confirm": {
      "title": "Posting jurnal ke buku besar?",
      "description": "Sesudah diposting, jurnal ini tidak bisa diubah maupun dihapus. Koreksinya lewat Reverse."
    },
    "refresh": true,
    "visibleWhen": {
      "field": "can_post",
      "op": "is_true"
    }
  },

  {
    "key": "reverse",
    "label": "Reverse",
    "icon": "Undo2",
    "variant": "destructive",
    "placement": "secondary",
    "modes": [
      "edit",
      "detail"
    ],
    "endpoint": "/api/finance/journals/{id}/reverse/",
    "method": "post",
    "fields": [
      {
        "key": "reason",
        "type": "textarea",
        "label": "Reason",
        "required": true,
        "help_text": "Tercetak di keterangan jurnal pembaliknya."
      },
      {
        "key": "posting_date",
        "type": "date",
        "label": "Reversal Posting Date",
        "required": false,
        "help_text": "Kosong = tanggal jurnal aslinya. Isi kalau periode lamanya sudah ditutup."
      }
    ],
    "refresh": true,
    "visibleWhen": {
      "field": "can_reverse",
      "op": "is_true"
    }
  },

  {
    "key": "cancel_journal",
    "label": "Cancel",
    "icon": "Ban",
    "variant": "destructive",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/finance/journals/{id}/cancel/",
    "method": "post",
    "fields": [
      {
        "key": "reason",
        "type": "textarea",
        "label": "Reason",
        "required": false
      }
    ],
    "confirm": {
      "title": "Batalkan jurnal ini?",
      "description": "Dokumen ditutup berstatus Cancelled. Yang sudah diposting tidak dibatalkan — ia dibalik."
    },
    "refresh": true,
    "visibleWhen": {
      "status": [
        "draft",
        "rejected",
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
export const journalsCollectionActions: CollectionAction[] = [
  {
    "key": "post_all",
    "label": "Post Selected",
    "icon": "BookCheck",
    "variant": "default",
    "endpoint": "/api/finance/journals/post-all/",
    "method": "post",
    "selection": "optional",
    "idsField": "ids",
    "confirm": {
      "title": "Posting jurnal ke buku besar?",
      "description": "Jurnal yang sudah diposting dilewati, bukan digagalkan. Yang tidak lolos pemeriksaan dilaporkan beserta alasannya dan tidak menghentikan sisanya."
    }
  },
]
