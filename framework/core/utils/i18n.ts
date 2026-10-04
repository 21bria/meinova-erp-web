/*
|--------------------------------------------------------------------------
| Terjemahan untuk kode framework yang BUKAN template
|--------------------------------------------------------------------------
|
| Di template, `$t()` sudah tersedia di mana-mana lewat `globalInjection`
| dan itu yang harus dipakai. Berkas ini untuk tiga tempat yang tidak
| punya template:
|
|   - definisi kolom (`column.ts`) yang merakit header lewat `h()`
|   - label hasil generator yang tersimpan sebagai konfigurasi
|   - label status/enum yang datang dari API sebagai kode stabil
|
| **Aturan yang tidak boleh dilanggar:** setiap fungsi di sini menerima
| teks Inggris sebagai fallback, dan mengembalikannya apa adanya kalau
| kuncinya tidak ada. Jadi kunci yang salah ketik, modul yang belum
| diterjemahkan, dan kode yang berjalan di luar konteks Nuxt semuanya
| menghasilkan layar yang **persis seperti sebelum i18n dipasang** —
| bukan `common.actions.save` mentah di tengah tombol.
*/

import { intlLocale } from "@/i18n/config"

/*
| Composer sisi klien.
|
| Sengaja **hanya diisi di klien**. Di server satu proses melayani banyak
| request sekaligus, dan variabel modul seperti ini dipakai bersama —
| menyimpan composer milik satu pengguna di sini berarti pengguna
| berikutnya bisa mendapat bahasanya. Jalur server memakai `useNuxtApp()`
| yang per-request, atau jatuh ke teks Inggris.
*/
let clientComposer: { t: (k: string) => string, te: (k: string) => boolean } | null = null

export function registerFrameworkI18n(composer: any) {
  if (import.meta.client)
    clientComposer = composer
}

function composer() {
  /*
   * `useNuxtApp()` lebih dulu: ia mengembalikan instance milik request
   * yang sedang berjalan, jadi benar di server maupun klien. Ia melempar
   * kalau dipanggil di luar konteks Nuxt — dan render function TanStack
   * Table adalah salah satu tempat itu bisa terjadi.
   */
  try {
    const nuxtApp = useNuxtApp()

    if (nuxtApp?.$i18n)
      return nuxtApp.$i18n as any
  }
  catch {
    // Di luar konteks Nuxt — lanjut ke composer klien.
  }

  return clientComposer
}

/**
 * Menerjemahkan `key`, atau mengembalikan `fallback` apa adanya.
 *
 * `te()` diperiksa lebih dulu supaya kunci yang belum ada tidak tampil
 * sebagai kuncinya sendiri.
 */
export function translate(
  key: string,
  fallback: string,
  params?: Record<string, unknown>,
): string {
  const i18n = composer()

  if (!i18n)
    return fallback

  try {
    if (!i18n.te(key))
      return fallback

    /*
     * `params` dioper ke vue-i18n, tidak ditambal sendiri dengan
     * `.replace("{label}", …)` sesudahnya.
     *
     * Alasannya bukan gaya: vue-i18n **selalu** menafsirkan `{label}`
     * di dalam pesan sebagai slot interpolasi. Dipanggil tanpa params,
     * slot itu diisi string kosong — "Select {label}" keluar sebagai
     * "Select", dan `.replace()` sesudahnya tidak menemukan apa pun
     * untuk diganti. Gagalnya diam: labelnya cuma hilang.
     */
    return params ? i18n.t(key, params) : i18n.t(key)
  }
  catch {
    return fallback
  }
}

/**
 * Label field/kolom hasil generator.
 *
 * Bentuk yang dipancarkan generator:
 *
 *     column.text("employee_no", resourceLabel("hr.employee.fields.employee_no", "Employee Number"))
 *
 * Argumen kedua adalah label Inggris yang dulu ditulis langsung di sana.
 * Jadi modul yang kuncinya belum diisi berperilaku persis seperti
 * sebelumnya, dalam bahasa apa pun — dan penerjemahannya bisa dicicil
 * modul demi modul tanpa satu pun regenerate.
 */
export function resourceLabel(key: string, fallback: string): string {
  const found = translate(key, "")

  if (found)
    return found

  /*
   * Kunci `*.filters.<field>` jatuh ke `*.fields.<field>`.
   *
   * Generator memancarkan dua ruang kunci — kolom ke `fields`, penyaring
   * ke `filters` — supaya keduanya BISA dibedakan kalau memang perlu.
   * Tapi keduanya berangkat dari `meta.label` yang sama persis di schema
   * backend, jadi hampir selalu sama. Tanpa fallback ini tiap label
   * harus ditulis dua kali di katalog, dan salinan kedua yang lupa
   * diperbarui adalah cara paling sunyi untuk membuat penyaring dan
   * kolomnya menyebut hal yang sama dengan dua nama.
   *
   * Menulis `filters.<field>` secara eksplisit tetap menang.
   */
  if (key.includes(".filters.")) {
    const asField = translate(key.replace(".filters.", ".fields."), "")

    if (asField)
      return asField
  }

  /*
   * Lalu kamus bersama: `<ns>.fields.code` jatuh ke `common.fields.code`,
   * `<ns>.tabs.general` ke `common.tabs.general`.
   *
   * Alasannya angka. Dari 1.077 kolom yang dipancarkan generator di
   * seluruh modul, sepuluh nama field teratas — `is_active`, `code`,
   * `name`, `sort_order`, `company_name` — sudah mengisi hampir
   * separuhnya. Tanpa lapisan ini, "Code" harus ditulis ulang di 92
   * katalog modul, dan modul ke-93 yang lupa akan tetap berbahasa
   * Inggris untuk pengguna Indonesia tanpa error apa pun.
   *
   * Ini lapisan **terakhir sebelum fallback Inggris**, jadi katalog
   * modul selalu menang. Field yang artinya berbeda antarmodul cukup
   * ditulis di katalog modulnya sendiri; yang tidak ditulis mendapat
   * arti umumnya, dan itu memang yang benar untuk `code`/`name`.
   */
  const shared = key.match(/\.(fields|filters|tabs|empty|placeholder)\.(.+)$/)

  if (shared) {
    const space = shared[1] === "filters" ? "fields" : shared[1]
    const asShared = translate(`common.${space}.${shared[2]}`, "")

    if (asShared)
      return asShared
  }

  return fallback
}

/**
 * Label untuk kode status/enum yang dikirim API.
 *
 * **Yang diterjemahkan hanya tampilannya.** Nilai yang dikirim dan
 * disimpan tetap `APPROVED`; tidak ada satu pun perbandingan di
 * codebase yang boleh memakai hasil fungsi ini.
 *
 *     statusLabel("APPROVED")            -> "Disetujui" / "Approved"
 *     statusLabel("SETTLED", "Settled")  -> "Settled"  (belum ada kuncinya)
 *
 * Kunci dicari di `common.status.<kode huruf kecil>`. Kode yang belum
 * punya terjemahan jatuh ke `fallback` — yaitu label yang dikirim API,
 * atau kodenya sendiri kalau API tidak mengirim label.
 */
export function statusLabel(
  value: string | null | undefined,
  fallback?: string | null,
): string {
  if (value === null || value === undefined || value === "")
    return fallback ?? ""

  const code = String(value)

  return translate(
    `common.status.${code.toLowerCase()}`,
    fallback ?? code,
  )
}

/**
 * Tag BCP-47 bahasa yang sedang aktif, untuk `Intl.*`.
 *
 * Jatuh ke bawaan (`en`) kalau composer belum ada — mis. saat dipanggil
 * di luar konteks Nuxt. Hasilnya selalu tag yang sah, jadi pemanggil
 * tidak pernah perlu menjaga `Intl` dari `RangeError`.
 */
export function activeIntlLocale(): string {
  const i18n = composer() as any

  try {
    return intlLocale(i18n?.locale?.value)
  }
  catch {
    return intlLocale(null)
  }
}

/**
 * Angka menurut bahasa yang aktif.
 *
 *     en -> 1,234.56
 *     id -> 1.234,56
 *
 * **Yang berubah hanya tanda bacanya.** Nilainya tidak dibulatkan di
 * luar `maximumFractionDigits` yang diminta pemanggil, dan tidak ada
 * satu pun perhitungan yang boleh memakai hasil fungsi ini — payroll,
 * pajak, dan BPJS menghitung dari angka mentahnya.
 */
export function formatLocaleNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(activeIntlLocale(), options).format(value)
}

/**
 * Karakter pemisah ribuan dan desimal untuk bahasa yang aktif.
 *
 * Dipakai kolom uang untuk **membaca kembali** apa yang ia tampilkan
 * sendiri. Diturunkan dari `Intl`, bukan ditulis tangan, supaya bahasa
 * ketiga tidak perlu menambah tabel pemisah kedua di suatu tempat.
 */
export function localeSeparators(): { group: string, decimal: string } {
  const parts = new Intl.NumberFormat(activeIntlLocale())
    .formatToParts(12345.6)

  return {
    group: parts.find(part => part.type === "group")?.value ?? ",",
    decimal: parts.find(part => part.type === "decimal")?.value ?? ".",
  }
}

/*
| Akhiran kolom yang menandai "ini tampilan sebuah kode enum".
|
| Konvensi serializer di repo ini konsisten dan **membedakan dua hal
| yang tidak boleh dicampur**:
|
|   `<field>_label` / `<field>_display`  -> tampilan kode enum sistem
|   `<field>_name`                       -> nama milik tenant
|
| `_name` sengaja TIDAK ada di daftar ini. `department_name` berisi
| "Plant Maintenance", `company_name` berisi nama badan usaha — data
| bisnis, dan menerjemahkannya persis hal yang dilarang. Batas itu
| dijaga di sini, sekali, bukan di tiap layar.
*/
const ENUM_DISPLAY_SUFFIXES = ["_label", "_display"] as const

/**
 * Nama field kode di balik sebuah kolom tampilan, atau `null`.
 *
 *     "status_label"        -> "status"
 *     "approver_type_label" -> "approver_type"
 *     "company_name"        -> null
 */
export function enumCodeField(columnKey: string): string | null {
  for (const suffix of ENUM_DISPLAY_SUFFIXES) {
    if (columnKey.length > suffix.length && columnKey.endsWith(suffix))
      return columnKey.slice(0, -suffix.length)
  }

  return null
}

/**
 * Label untuk kode enum, dicari **per field** lebih dulu.
 *
 * Urutannya:
 *
 *   1. `codes.<field>.<code>`   — mis. `codes.approver_type.role`
 *   2. `common.status.<code>`   — status umum yang dipakai lintas modul
 *   3. `fallback`               — teks Inggris dari API, apa adanya
 *
 * Dicari per field, bukan dalam satu ruang datar, karena kode enum di
 * ERP ini pendek dan generik: `role`, `manager`, `position`, `user`.
 * Satu ruang datar berarti enum HR bernama `manager` suatu hari
 * memungut label milik Workflow, dan salahnya tidak berbunyi — cuma
 * satu kolom yang menyebut hal lain.
 */
export function codeLabel(
  field: string,
  code: string | null | undefined,
  fallback?: string | null,
): string {
  if (code === null || code === undefined || code === "")
    return fallback ?? ""

  const raw = String(code)
  const normalized = raw.toLowerCase()

  const scoped = translate(`codes.${field}.${normalized}`, "")

  if (scoped)
    return scoped

  return statusLabel(normalized, fallback ?? raw)
}

/**
 * Padanan `statusLabel` untuk pasangan `{value, label}` yang dikirim API.
 *
 * Kontrak API tidak berubah: `value` tetap kode stabil dan `label` tetap
 * teks Inggris dari backend. Yang berubah cuma mana yang ditampilkan.
 */
export function optionLabel(
  option: { value?: string | null, label?: string | null } | null | undefined,
): string {
  if (!option)
    return ""

  return statusLabel(option.value, option.label ?? option.value ?? "")
}
