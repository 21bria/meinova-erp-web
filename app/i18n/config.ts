/*
|--------------------------------------------------------------------------
| Daftar bahasa yang didukung
|--------------------------------------------------------------------------
|
| Satu-satunya tempat yang menyebutkan bahasa apa saja yang ada. Menambah
| bahasa ketiga berarti menambah satu baris di sini plus satu folder di
| `locales/` — tidak ada berkas lain yang perlu tahu.
|
| `code` sengaja pendek (`en`, `id`) dan itulah yang **disimpan**: di
| cookie, di kolom `User.language` backend, dan di URL kalau suatu saat
| dibutuhkan. `intl` adalah tag BCP-47 yang dipakai `Intl.*` untuk
| memformat tanggal dan angka — dua hal yang berbeda dan tidak boleh
| dicampur. `id` bukan locale yang dikenal `Intl`; `id-ID` yang dikenal.
|
| **Bahasa bukan zona waktu.** Tidak ada satu pun kolom di sini yang
| menyebut timezone, dan itu disengaja — mengganti bahasa tidak boleh
| menggeser jam tampil satu menit pun.
*/

export type LocaleCode = 'en' | 'id'

export interface LocaleDescriptor {
  /** Kode yang disimpan. Stabil; jangan diubah setelah dipakai. */
  code: LocaleCode
  /** Tag BCP-47 untuk `Intl.DateTimeFormat` / `Intl.NumberFormat`. */
  intl: string
  /** Nama bahasa dalam bahasa itu sendiri — yang tampil di pemilih. */
  label: string
}

export const LOCALES: readonly LocaleDescriptor[] = [
  { code: 'en', intl: 'en', label: 'English' },
  { code: 'id', intl: 'id-ID', label: 'Bahasa Indonesia' },
] as const

/*
| Bawaan tetap `en`.
|
| Seluruh UI hari ini berbahasa Inggris, jadi pengguna yang belum pernah
| memilih apa pun harus melihat layar yang **persis sama** dengan
| sebelum perubahan ini. Menjadikan `id` bawaan akan mengubah tampilan
| setiap akun yang sudah ada tanpa seorang pun memintanya.
*/
export const DEFAULT_LOCALE: LocaleCode = 'en'

/*
| Rantai fallback pesan.
|
| Kunci yang belum diterjemahkan ke `id` jatuh ke `en`, bukan tampil
| sebagai kunci mentah (`common.actions.save`) di layar orang.
*/
export const FALLBACK_LOCALE: LocaleCode = 'en'

export const LOCALE_CODES: readonly LocaleCode[] = LOCALES.map(l => l.code)

export function isLocaleCode(value: unknown): value is LocaleCode {
  return typeof value === 'string'
    && (LOCALE_CODES as readonly string[]).includes(value)
}

export function localeDescriptor(code: LocaleCode): LocaleDescriptor {
  return LOCALES.find(l => l.code === code)
    ?? LOCALES.find(l => l.code === DEFAULT_LOCALE)!
}

/**
 * Tag `Intl` untuk sebuah kode bahasa.
 *
 * Dipakai formatter tanggal/angka. Kode yang tidak dikenal jatuh ke
 * bawaan alih-alih diteruskan ke `Intl` — `new Intl.NumberFormat("xx")`
 * melempar `RangeError`, dan satu nilai rusak di cookie tidak boleh
 * menjatuhkan seluruh halaman.
 */
export function intlLocale(code: string | null | undefined): string {
  return localeDescriptor(isLocaleCode(code) ? code : DEFAULT_LOCALE).intl
}

/**
 * Menormalkan apa pun yang datang dari luar menjadi kode yang sah.
 *
 * Sumbernya bermacam-macam dan tidak satu pun bisa dipercaya: cookie
 * yang bisa disunting orang, `navigator.language` yang berbentuk
 * `id-ID` atau `en-GB`, dan kolom backend yang bisa saja kosong untuk
 * akun lama. Semua lewat sini.
 */
export function normalizeLocale(
  value: string | null | undefined,
  fallback: LocaleCode = DEFAULT_LOCALE,
): LocaleCode {
  if (!value)
    return fallback

  const raw = String(value).trim().toLowerCase()

  if (isLocaleCode(raw))
    return raw

  // `id-ID`, `en-US`, `en_GB` — ambil bagian bahasanya saja.
  const base = raw.split(/[-_]/)[0]

  return isLocaleCode(base) ? base : fallback
}
