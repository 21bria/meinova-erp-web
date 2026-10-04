import type { CollectionAction, RecordAction } from "@framework"

/*
 * Tombol yang menembak endpoint `@action` milik viewset untuk satu
 * record — Submit, Approve, Reject, dan tombol khusus modul lain.
 *
 * Digenerate dari `schema.actions` di backend. Kosong berarti resource
 * ini memang tidak punya action selain CRUD biasa.
 */
export const rosterPoliciesRecordActions: RecordAction[] = [
  {
    "key": "copy_to_companies",
    "label": "Copy to Companies",
    "icon": "Copy",
    "variant": "outline",
    "placement": "secondary",
    "modes": [
      "edit"
    ],
    "endpoint": "/api/administration/references/hr/roster-policies/{id}/copy-to-companies/",
    "method": "post",
    "fields": [
      {
        "key": "company_ids",
        "type": "multilookup",
        "label": "Target Companies",
        "required": true,
        "endpoint": "/api/administration/references/hr/roster-policies/{id}/copy-targets/",
        "label_key": "label",
        "value_key": "value",
        "disabled_key": "already_copied",
        "placeholder": "Pilih company tujuan…",
        "help_text": "Lokasinya dicocokkan lewat Location Type, bukan kodenya — kode hanya unik per company. Yang tidak punya lokasi bertipe sama, atau justru punya lebih dari satu, dimatikan beserta alasannya."
      }
    ],
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
export const rosterPoliciesCollectionActions: CollectionAction[] = []
