import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const fiscalYearsRecordActions: RecordAction[] = [
  {
    "key": "generate_periods",
    "label": "Generate Periods",
    "icon": "CalendarRange",
    "variant": "default",
    "placement": "primary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/finance/fiscal-years/{id}/generate-periods/",
    "method": "post",
    "fields": [
      {
        "key": "count",
        "type": "integer",
        "label": "Number of Periods",
        "required": true,
        "default": 12,
        "help_text": "12 = bulanan. 4 = kuartalan. 13 = empat mingguan."
      }
    ],
    "confirm": {
      "title": "Susun periode akuntansi?",
      "description": "Periode dibuat merata sepanjang tahun buku dan semuanya berstatus Open. Bisa disunting satu per satu sesudahnya."
    },
    "refresh": true,
    "visibleWhen": {
      "field": "can_generate_periods",
      "op": "is_true"
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
export const fiscalYearsCollectionActions: CollectionAction[] = []
