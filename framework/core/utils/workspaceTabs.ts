/*
|--------------------------------------------------------------------------
| Tab workspace yang menunggu record tersimpan
|--------------------------------------------------------------------------
|
| Tab `requiresRecord` dikunci di halaman Create karena isinya menempel ke
| id record — baris anak (leg perjalanan) butuh induknya, snapshot dan
| riwayat baru ada sesudah simpan pertama. Tab yang dikunci tanpa
| penjelasan terbaca seperti tombol rusak, jadi tiap tab membawa kalimat
| "simpan dulu" yang tampil di samping labelnya.
|
| Kuncinya `<namespace>.saveFirst.<tab>`, namespace-nya diambil dari
| `labelKey` tab (`hr.business-trips.fields.travel` → `hr.business-trips`).
| Modul yang belum menulis kalimat khusus mendapat kalimat umum
| `common.workspace.saveFirst`.
*/

import { translate } from "./i18n"

export interface SaveFirstTab {
  key?: string | null
  labelKey?: string | null
  requiresRecord?: boolean | null
}

/** Kunci kalimat khusus tab, atau `null` kalau tab tidak punya namespace. */
export function saveFirstHintKey(tab: SaveFirstTab): string | null {
  const labelKey = String(tab?.labelKey ?? "")
  const marker = labelKey.indexOf(".fields.")

  if (!tab?.key || marker <= 0)
    return null

  return `${labelKey.slice(0, marker)}.saveFirst.${tab.key}`
}

/** Kalimat "simpan dulu" untuk tab `requiresRecord`; kosong untuk tab lain. */
export function saveFirstHint(tab: SaveFirstTab): string {
  if (tab?.requiresRecord !== true)
    return ""

  const generic = translate(
    "common.workspace.saveFirst",
    "Save this record first to use this section.",
  )

  const key = saveFirstHintKey(tab)

  return key ? translate(key, generic) : generic
}
