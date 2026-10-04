import { fromISODate } from '@framework/core/utils/dashboard'
import { isISODate } from '@framework/core/utils/date'
import { intlLocale } from '~/i18n/config'

/*
|--------------------------------------------------------------------------
| Format tanggal, angka, dan mata uang menurut bahasa aktif
|--------------------------------------------------------------------------
|
| **Tambahan, bukan pengganti.** `formatDate`/`formatDateTime` di
| `app/utils/formatDate.ts` tetap seperti apa adanya — keduanya
| mengembalikan `dd-mm-yyyy` yang sama di bahasa apa pun, dan ratusan
| layar sudah memakainya. Menggantinya berarti mengubah tampilan tiap
| tanggal di seluruh aplikasi dalam satu perubahan yang judulnya
| "dukungan multibahasa"; itu bukan yang diminta siapa pun.
|
| Yang di sini untuk layar baru dan untuk tempat yang memang ingin
| menampilkan tanggal dalam bentuk yang wajar bagi pembacanya
| ("8 Sep 2026" vs "Sep 8, 2026").
|
| Tiga hal yang TIDAK dilakukan berkas ini:
|
|   - tidak menyentuh nilai yang tersimpan — semuanya murni tampilan
|   - tidak mengubah zona waktu; `timeZone` diambil dari perangkat
|     pembacanya, persis seperti perilaku `formatDate` yang lama
|   - tidak mengubah pembulatan atau presisi angka yang dipakai
|     perhitungan
*/

/*
| Tanggal tanpa jam dirakit dari komponennya, bukan lewat
| `new Date("2026-09-25")` — yang dibaca JS sebagai tengah malam UTC
| dan karenanya mundur sehari di zona yang di belakang UTC. Alasan
| lengkapnya di `app/utils/formatDate.ts`; keduanya harus setuju,
| karena satu layar bisa memakai keduanya.
|
| Yang membawa jam tetap ditafsirkan apa adanya.
*/
function parse(value?: string | Date | number | null) {
  if (value === null || value === undefined || value === '')
    return null

  if (typeof value === 'string' && isISODate(value))
    return fromISODate(value)

  const date = value instanceof Date ? value : new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

export function useLocaleFormat() {
  const { locale } = useLocale()

  const tag = computed(() => intlLocale(locale.value))

  /** `08 Sep 2026` / `Sep 08, 2026` — tergantung bahasanya. */
  function date(
    value?: string | Date | number | null,
    options: Intl.DateTimeFormatOptions = {},
  ) {
    const parsed = parse(value)

    if (!parsed)
      return '-'

    return new Intl.DateTimeFormat(tag.value, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      ...options,
    }).format(parsed)
  }

  /** Tanggal + jam, 24 jam di kedua bahasa. */
  function dateTime(
    value?: string | Date | number | null,
    options: Intl.DateTimeFormatOptions = {},
  ) {
    return date(value, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      ...options,
    })
  }

  /**
   * Angka dengan pemisah ribuan menurut bahasanya.
   *
   * `1234567.5` -> `1.234.567,5` (id) / `1,234,567.5` (en).
   *
   * Yang berubah hanya tanda bacanya. Nilainya tidak dibulatkan di luar
   * `maximumFractionDigits` yang diminta pemanggil, dan tidak ada satu
   * pun perhitungan yang boleh memakai hasil fungsi ini.
   */
  function number(
    value?: number | string | null,
    options: Intl.NumberFormatOptions = {},
  ) {
    if (value === null || value === undefined || value === '')
      return '-'

    const num = typeof value === 'number' ? value : Number(value)

    if (Number.isNaN(num))
      return '-'

    return new Intl.NumberFormat(tag.value, {
      maximumFractionDigits: 2,
      ...options,
    }).format(num)
  }

  /**
   * Mata uang.
   *
   * `currency` **wajib disebut pemanggil** dan tidak punya bawaan yang
   * ditebak dari bahasa. Bahasa antarmuka tidak menentukan mata uang
   * sebuah dokumen: perusahaan yang membukukan dalam USD tetap USD
   * meski antarmukanya berbahasa Indonesia. Menebaknya dari locale
   * adalah cara paling halus untuk salah menampilkan angka uang.
   */
  function currency(
    value?: number | string | null,
    currencyCode = 'IDR',
    options: Intl.NumberFormatOptions = {},
  ) {
    return number(value, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: currencyCode === 'IDR' ? 0 : 2,
      ...options,
    })
  }

  return { locale, intlTag: tag, date, dateTime, number, currency }
}
