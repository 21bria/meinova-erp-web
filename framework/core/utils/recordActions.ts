/*
|--------------------------------------------------------------------------
| Record action — teks dan isian dialog
|--------------------------------------------------------------------------
|
| Dua hal yang dipakai `MRecordActions` dan sengaja dipisah ke fungsi
| murni supaya bisa diuji tanpa DOM:
|
| 1. **Teks dwibahasa.** Generator menitipkan `i18nKey`
|    (`<namespace>.actions.<key>`) di samping label Inggris dari schema.
|    Kuncinya dicari saat render — `actions.ts` adalah `const` tingkat
|    modul, dan memanggil penerjemah di sana menghasilkan bahasa Inggris
|    untuk kedua bahasa. Tanpa `i18nKey`, atau kunci yang belum ada di
|    katalog, yang tampil adalah teks schema apa adanya — persis seperti
|    sebelum fungsi ini ada.
|
| 2. **Waktu yang dikirim action.** `MDateTimeField` memegang jam dinding
|    tanpa zona (`2026-10-01T17:00`). Endpoint action membacanya dengan
|    `parse_datetime`, yang mengembalikan waktu **naif** untuk bentuk itu
|    — dan membandingkannya dengan kolom ber-zona di service gagal.
|    Yang dikirim karena itu instan lengkap dengan offset browser
|    (`2026-10-01T17:00:00+07:00`): jam yang diketik pengguna, di zona
|    tempat ia mengetiknya.
*/

import { translate } from "./i18n"

export interface ActionTextSource {
  key: string
  label: string
  i18nKey?: string | null
  confirm?: boolean | { title?: string, description?: string } | null
}

export interface ActionFieldSource {
  key: string
  type?: string
  label?: string
}

function scoped(action: ActionTextSource, path: string, fallback: string): string {
  if (!action.i18nKey)
    return fallback

  return translate(`${action.i18nKey}.${path}`, fallback)
}

/** Label tombol. */
export function actionLabel(action: ActionTextSource): string {
  return scoped(action, "label", action.label)
}

/**
 * Judul + keterangan dialog konfirmasi, atau `null` kalau action-nya
 * tidak meminta konfirmasi.
 */
export function actionConfirm(
  action: ActionTextSource,
): { title: string, description: string } | null {
  if (!action.confirm)
    return null

  const label = actionLabel(action)

  if (action.confirm === true) {
    return {
      title: scoped(action, "confirm.title", `${label}?`),
      description: scoped(
        action,
        "confirm.description",
        translate("common.messages.irreversible", "Tindakan ini tidak bisa dibatalkan."),
      ),
    }
  }

  return {
    title: scoped(action, "confirm.title", action.confirm.title ?? `${label}?`),
    description: scoped(
      action,
      "confirm.description",
      action.confirm.description ?? "",
    ),
  }
}

/** Label satu isian di dialog action. */
export function actionFieldLabel(
  action: ActionTextSource,
  field: ActionFieldSource,
): string {
  return scoped(action, `fields.${field.key}`, field.label ?? field.key)
}

function pad(value: number): string {
  return String(Math.trunc(Math.abs(value))).padStart(2, "0")
}

/**
 * Jam dinding `YYYY-MM-DDTHH:mm[:ss]` → ISO dengan offset.
 *
 * `offsetMinutes` = menit **di depan** UTC (WIB = 420). Bawaannya offset
 * browser pada tanggal itu, jadi peralihan musim (di zona yang
 * memakainya) ikut terhitung. Nilai yang sudah membawa zona, atau yang
 * bukan jam dinding, dikembalikan apa adanya — backend yang menolaknya
 * dengan pesannya sendiri.
 */
export function toOffsetIso(local: string, offsetMinutes?: number): string {
  const text = String(local ?? "").trim()

  const match = text.match(
    /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/,
  )

  if (!match)
    return text

  const [, day, hour, minute, second] = match

  const offset = offsetMinutes
    ?? -new Date(`${day}T${hour}:${minute}:${second ?? "00"}`).getTimezoneOffset()

  const sign = offset < 0 ? "-" : "+"

  return `${day}T${hour}:${minute}:${second ?? "00"}`
    + `${sign}${pad(offset / 60)}:${pad(offset % 60)}`
}

/**
 * Isian dialog → body request. Hanya isian bertipe `datetime` yang
 * diubah; sisanya dikirim apa adanya.
 */
export function actionBody(
  fields: ActionFieldSource[] | null | undefined,
  values: Record<string, any>,
  offsetMinutes?: number,
): Record<string, any> {
  const body = { ...values }

  for (const field of fields ?? []) {
    if (field.type !== "datetime")
      continue

    const value = body[field.key]

    if (typeof value === "string" && value.trim())
      body[field.key] = toOffsetIso(value, offsetMinutes)
  }

  return body
}

/*
| Dipindah dari `MRecordActions.vue` (BT-5) apa adanya supaya bisa diuji.
*/
function valueAt(source: any, path: string) {
  return String(path)
    .split('.')
    .reduce(
      (carry, key) => (
        carry === null || carry === undefined
          ? undefined
          : carry[key]
      ),
      source,
    )
}

/*
| Syarat tampil, dua dialek dan dua-duanya sudah dipakai di schema:
|
|   {"status": ["draft", "rejected"]}      map path → nilai yang cocok
|   {"field": "status", "op": "in", ...}   bentuk field-level
|
| Menyeragamkannya berarti menulis ulang deklarasi yang sudah ada di
| Cuti dan Roster, jadi keduanya diterima. Syarat yang tidak bisa
| dinilai dianggap **terpenuhi** — tombol yang hilang gara-gara salah
| ketik jauh lebih sulit dilacak daripada tombol yang tampil lalu
| ditolak API dengan pesan jelas. Filosofi yang sama dengan `isGranted`.
*/
export function actionVisible(rule: any, record: any): boolean {
  if (!rule || typeof rule !== 'object')
    return true

  if (Array.isArray(rule.all))
    return rule.all.every((item: any) => actionVisible(item, record))

  if (Array.isArray(rule.any))
    return rule.any.some((item: any) => actionVisible(item, record))

  if (rule.not)
    return !actionVisible(rule.not, record)

  if (typeof rule.field === 'string') {
    const actual = valueAt(record, rule.field)

    switch (rule.op) {
      case 'in':
        return Array.isArray(rule.value)
          && rule.value.map(String).includes(String(actual))
      case 'not_in':
        return Array.isArray(rule.value)
          && !rule.value.map(String).includes(String(actual))
      case 'is_true':
        return actual === true
      case 'is_false':
        return actual === false
      case 'is_null':
        return actual === null || actual === undefined || actual === ''
      case 'is_not_null':
        return !(actual === null || actual === undefined || actual === '')
      case 'ne':
        return String(actual) !== String(rule.value)
      default:
        return String(actual) === String(rule.value)
    }
  }

  return Object.entries(rule).every(([path, expected]) => {
    const actual = valueAt(record, path)

    if (Array.isArray(expected))
      return expected.map(String).includes(String(actual))

    if (typeof expected === 'boolean')
      return actual === expected

    return String(actual) === String(expected)
  })
}
