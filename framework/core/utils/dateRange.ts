import type { CrudFilter } from "../../builders/filters/types"
import { fromISODate, toISODate } from "./dashboard"

/*
|--------------------------------------------------------------------------
| Rentang tanggal untuk daftar transaksional
|--------------------------------------------------------------------------
|
| Padanan frontend dari `apps.framework.list_period`. Kode presetnya
| sama persis, dan itu disengaja: "Bulan Lalu" harus berarti hal yang
| sama di kedua sisi, kalau tidak yang dikirim layar dan yang ditolak
| API menunjuk periode yang berbeda tanpa satu pun pesan yang
| menjelaskannya.
|
| Tanggalnya selalu dihitung **saat dipanggil**, tidak pernah disimpan
| sebagai konstanta tingkat module: konfigurasi filter adalah `const`
| yang dihitung sekali saat chunk-nya dimuat, dan "hari ini" yang ikut
| membeku di sana tertinggal satu hari pada sesi yang menyeberang
| tengah malam.
*/

export type DateRangeValue = {
  from: string | null
  to: string | null
}

export const DATE_RANGE_PRESETS = [
  "today",
  "last_7_days",
  "this_month",
  "last_month",
  "custom",
] as const

export type DateRangePreset = (typeof DATE_RANGE_PRESETS)[number]

export const DEFAULT_DATE_RANGE: DateRangePreset = "this_month"

/*
| `toISODate`/`fromISODate` dipinjam dari `dashboard.ts`, bukan ditulis
| ulang. Keduanya sudah memecahkan soal yang sama — `new Date("2026-08-08")`
| dibaca JS sebagai tengah malam **UTC**, jadi di zona barat tanggalnya
| mundur sehari — dan dua penurunan tanggal yang berbeda di satu aplikasi
| berarti periode di layar bisa bergeser dari periode yang diminta.
|
| Tidak di-reexport dari sini: barrel `@framework` sudah mengekspornya
| lewat `core/utils/dashboard`.
*/
function optionalDate(value: string | null | undefined): Date | null {
  if (!value)
    return null

  const [year, month, day] = String(value).split("-").map(Number)

  if (!year || !month || !day)
    return null

  return fromISODate(value)
}

/* Selisih hari inklusif — 1 dan 1 September adalah satu hari, bukan nol. */
export function rangeDays(value: DateRangeValue): number {
  const start = optionalDate(value.from)
  const end = optionalDate(value.to)

  if (!start || !end)
    return 0

  return Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1
}

export function resolvePreset(
  code: string | null | undefined,
  anchor: Date = new Date(),
): DateRangeValue {
  const today = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate())

  if (code === "today") {
    return { from: toISODate(today), to: toISODate(today) }
  }

  if (code === "last_7_days") {
    const start = new Date(today)

    // Enam hari ke belakang, bukan tujuh: "7 hari terakhir" yang
    // memuat hari ini berisi tujuh tanggal, dan mundur tujuh membuatnya
    // delapan.
    start.setDate(start.getDate() - 6)

    return { from: toISODate(start), to: toISODate(today) }
  }

  if (code === "last_month") {
    const end = new Date(today.getFullYear(), today.getMonth(), 0)
    const start = new Date(end.getFullYear(), end.getMonth(), 1)

    return { from: toISODate(start), to: toISODate(end) }
  }

  // `this_month` / `current_month` / apa pun yang tidak dikenali:
  // tanggal 1 bulan berjalan sampai hari ini. Yang tidak dikenali
  // sengaja jatuh ke sini dan bukan ke kosong — rentang kosong berarti
  // seluruh sejarah, dan itu kebalikan dari maksud penyaring ini.
  return {
    from: toISODate(new Date(today.getFullYear(), today.getMonth(), 1)),
    to: toISODate(today),
  }
}

/* Preset mana yang persis sama dengan rentang ini, kalau ada. */
export function matchPreset(
  value: DateRangeValue,
  presets: readonly string[] = DATE_RANGE_PRESETS,
): string | null {
  for (const code of presets) {
    if (code === "custom")
      continue

    const candidate = resolvePreset(code)

    if (candidate.from === value.from && candidate.to === value.to)
      return code
  }

  return null
}

export function dateRangeKeys(item: CrudFilter): [string, string] {
  return [item.fromKey ?? "date_from", item.toKey ?? "date_to"]
}

/*
| Nilai awal seluruh penyaring yang membawa bawaan.
|
| Dipakai **dua** tempat yang harus setuju: `useCrud` (yang mengirim
| permintaan pertama) dan `MCrudToolbar` (yang menampilkan periodenya).
| Kalau keduanya menurunkannya sendiri-sendiri, layar bisa menampilkan
| September sambil meminta Agustus — dan tidak ada satu pun error yang
| menyertainya.
*/
export function resolveFilterDefaults(
  items: CrudFilter[] | undefined | null,
): Record<string, any> {
  const values: Record<string, any> = {}

  for (const item of items ?? []) {
    if (item.type === "dateRange") {
      const [fromKey, toKey] = dateRangeKeys(item)
      const range = resolvePreset(item.defaultRange ?? DEFAULT_DATE_RANGE)

      values[fromKey] = range.from
      values[toKey] = range.to

      continue
    }

    if (item.defaultValue !== undefined && item.defaultValue !== null)
      values[item.key] = item.defaultValue
  }

  return values
}
