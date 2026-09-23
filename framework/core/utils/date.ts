/*
|--------------------------------------------------------------------------
| Tanggal tanpa jam — satu-satunya penerjemah antara layar dan API
|--------------------------------------------------------------------------
|
| Dua bentuk, dan hanya dua:
|
|     tampilan/ketikan   DD.MM.YY     25.09.26
|     API/database       YYYY-MM-DD   2026-09-25
|
| Backend tidak pernah melihat bentuk pertama, dan kotak isian tidak
| pernah menampilkan bentuk kedua. Itu bukan selera: begitu keduanya
| tinggal di satu string yang sama, tidak ada yang bisa memutuskan
| apakah "26" pada `2026-09-25` adalah tahun atau tanggal — dan
| penerjemah yang menebaknya akan menebak dua kali pada nilai yang
| sudah benar.
|
| Itu persis bug yang melahirkan berkas ini. Versi sebelumnya
| memperlakukan **apa pun** yang bertiga-bagian sebagai hari-dulu, lalu
| dipanggil terhadap nilai ISO yang baru saja diambil dari API:
|
|     "2026-09-27" -> d=2026, m=09, y=27 -> y dua digit -> 2027
|                  -> "2027-09-2026"
|
| Nilai itu lolos ke payload, dan kolom tanggal sebuah dokumen yang
| tidak disentuh siapa pun berubah hanya karena form-nya dibuka.
|
| Karena itu setiap fungsi di sini **idempoten terhadap bentuknya
| sendiri**: `parseDateInput` mengembalikan ISO apa adanya, dan
| `formatDateForDisplay` mengembalikan tampilan apa adanya. Memanggilnya
| dua kali tidak pernah berbeda dari memanggilnya sekali.
|
| Tidak ada `Date` di sini sama sekali. `new Date("2026-09-25")` dibaca
| JS sebagai tengah malam UTC, jadi di zona barat tanggalnya mundur
| sehari — dan tanggal lahir yang bergeser sehari tidak pernah
| menampilkan pesan error. Semuanya aritmetika bilangan bulat.
*/

/* `YYYY-MM-DD`, apa yang dikirim dan diterima API. */
const ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

/*
| `D.M.YY`, `DD.MM.YY`, `DD.MM.YYYY` — dan `-` / `/` sebagai pemisah
| yang sama saja, karena papan ketik numerik menaruh titiknya di tempat
| yang berbeda-beda.
|
| Hari dan bulan boleh satu digit: `25.9.26` adalah cara mengetik yang
| wajar, bukan kesalahan. Tahun tidak boleh tiga digit — itu selalu
| salah ketik, dan menebaknya lebih merugikan daripada menolaknya.
*/
const DISPLAY_PATTERN = /^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{2}|\d{4})$/

/*
| Batas tahun dua digit. 00–69 jatuh ke 2000-an, 70–99 ke 1900-an —
| aturan yang sama dengan versi sebelumnya, sengaja tidak diubah:
| memindahkannya akan menggeser tanggal yang sudah tersimpan di form
| yang sudah dipakai.
|
| Yang di luar jangkauannya tetap bisa diketik lengkap (`15.03.1965`),
| dan `formatDateForDisplay` memang menampilkannya lengkap — lihat di
| sana kenapa.
*/
export const TWO_DIGIT_YEAR_PIVOT = 70

/* Contoh yang dipakai placeholder dan hint di seluruh aplikasi. */
export const DATE_DISPLAY_FORMAT = "dd.mm.yy"

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function daysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12)
    return 0

  if (month === 2)
    return isLeapYear(year) ? 29 : 28

  return [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] as number
}

/*
| Tanggal yang benar-benar ada di kalender.
|
| Ini yang membedakan berkas ini dari `new Date(2026, 1, 31)`: JS
| menggulirkan 31 Februari menjadi 3 Maret tanpa keluhan, dan yang
| mengetiknya tidak pernah tahu tanggal yang tersimpan bukan yang
| dimaksudnya. Di sini 31 Februari ditolak.
*/
export function isValidCalendarDate(
  year: number,
  month: number,
  day: number,
): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day))
    return false

  if (year < 1 || year > 9999)
    return false

  if (month < 1 || month > 12)
    return false

  return day >= 1 && day <= daysInMonth(year, month)
}

export function expandTwoDigitYear(value: number): number {
  return value >= TWO_DIGIT_YEAR_PIVOT ? 1900 + value : 2000 + value
}

function iso(year: number, month: number, day: number): string {
  return [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-")
}

/* Bentuk API yang sah — struktur **dan** kalendernya. */
export function isISODate(value: unknown): value is string {
  const match = ISO_PATTERN.exec(String(value ?? ""))

  if (!match)
    return false

  return isValidCalendarDate(Number(match[1]), Number(match[2]), Number(match[3]))
}

/**
 * Apa pun yang diketik atau diterima -> `YYYY-MM-DD`, atau `null`.
 *
 * `null` berarti "belum/bukan tanggal", dan itu mencakup dua hal yang
 * sengaja tidak dibedakan pemanggil: kosong, dan tidak sah. Yang
 * membedakannya adalah kotak isiannya sendiri — ia tahu apakah ada
 * sesuatu yang sedang diketik di sana.
 *
 * Nilai yang **sudah** ISO dikembalikan apa adanya. Itu janji yang
 * membuat fungsi ini aman dipanggil terhadap nilai dari API, dan yang
 * absennya melahirkan `2027-09-2026`.
 */
export function parseDateInput(value: unknown): string | null {
  const raw = String(value ?? "").trim()

  if (!raw)
    return null

  const isoMatch = ISO_PATTERN.exec(raw)

  if (isoMatch) {
    const [, y, m, d] = isoMatch

    return isValidCalendarDate(Number(y), Number(m), Number(d)) ? raw : null
  }

  const match = DISPLAY_PATTERN.exec(raw)

  if (!match)
    return null

  const [, dayPart, monthPart, yearPart] = match

  const day = Number(dayPart)
  const month = Number(monthPart)
  const year = yearPart!.length === 2
    ? expandTwoDigitYear(Number(yearPart))
    : Number(yearPart)

  return isValidCalendarDate(year, month, day) ? iso(year, month, day) : null
}

/**
 * `YYYY-MM-DD` -> `DD.MM.YY`.
 *
 * Tahunnya dipendekkan **hanya kalau bisa kembali utuh**. `2026` lewat
 * `26` memang kembali ke 2026, jadi ditampilkan `25.09.26`. `1965`
 * lewat `65` kembali ke 2065 — seratus tahun meleset — jadi
 * ditampilkan `15.03.1965`.
 *
 * Tanpa syarat itu, membuka lalu menyimpan ulang data pegawai akan
 * memindahkan tanggal lahir satu abad ke depan, dan tidak ada satu pun
 * pesan yang menyertainya. Kontrak `DD.MM.YY` berlaku untuk tanggal
 * yang memang bisa dinyatakan begitu; sisanya lebih baik panjang
 * daripada salah.
 *
 * Yang bukan ISO dikembalikan apa adanya, tidak dikosongkan — kotak
 * kosong terbaca seperti data yang belum diisi, dan yang membacanya
 * akan menekan Save dan benar-benar mengosongkannya.
 */
export function formatDateForDisplay(value: unknown): string {
  const raw = String(value ?? "").trim()

  if (!raw)
    return ""

  const match = ISO_PATTERN.exec(raw)

  if (!match)
    return raw

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  if (!isValidCalendarDate(year, month, day))
    return raw

  const short = year % 100
  const yearPart = expandTwoDigitYear(short) === year
    ? String(short).padStart(2, "0")
    : String(year).padStart(4, "0")

  return `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${yearPart}`
}

/**
 * @deprecated Pakai `parseDateInput` (yang membedakan tidak sah dari
 * kosong) atau `formatDateForDisplay`.
 *
 * Dipertahankan karena diekspor barrel `@framework` dan bisa dipanggil
 * dari luar repo ini. Sekarang idempoten: ISO masuk, ISO yang sama
 * keluar. Yang tidak terbaca dikembalikan apa adanya supaya kesalahan
 * ketik tetap terlihat di layar alih-alih hilang menjadi kosong.
 */
export function normalizeDateInput(value: string): string {
  const raw = String(value ?? "").trim()

  return parseDateInput(raw) ?? raw
}
