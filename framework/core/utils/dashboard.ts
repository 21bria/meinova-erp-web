// framework/core/utils/dashboard.ts

import type {
  DashboardFormat,
  DashboardPeriodMode,
  DashboardPeriodState,
} from "../types/dashboard"

import { activeIntlLocale, formatLocaleNumber, translate } from "./i18n"

/*
| Nama bulan **diturunkan dari bahasa aktif**, bukan dari dua daftar
| yang ditulis tangan.
|
| Daftar tetap berbahasa Indonesia adalah alasan tombol periode masih
| berbunyi "Agustus 2026" untuk pengguna English: teksnya benar, bahasanya
| tidak, dan tidak ada error apa pun yang menandainya. `Intl` sudah tahu
| nama bulan di kedua bahasa, jadi bahasa ketiga nanti tidak menambah
| tabel ketiga.
|
| `timeZone: "UTC"` wajib: tanggal 1 pukul 00:00 lokal di zona timur
| adalah tanggal 30/31 bulan sebelumnya dalam UTC, dan namanya ikut
| mundur satu bulan.
*/
function monthName(month: number, style: "long" | "short"): string {
  const index = Math.min(Math.max(Math.trunc(month), 1), 12) - 1

  return new Intl.DateTimeFormat(activeIntlLocale(), {
    month: style,
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2000, index, 1)))
}

export function monthLabel(month: number): string {
  return monthName(month, "long")
}

export function monthAbbr(month: number): string {
  return monthName(month, "short")
}

export function periodLabel(year: number, month: number): string {
  return `${monthLabel(month)} ${year}`
}

/*
|--------------------------------------------------------------------------
| Periode
|--------------------------------------------------------------------------
| Cerminan `apps/framework/periods.py`. Rentangnya dihitung ulang di sini
| supaya tombol filter bisa langsung menampilkan label yang benar tanpa
| menunggu respons — backend tetap yang berwenang atas angkanya, jadi dua
| sisi ini harus tetap sepakat soal awal minggu (Senin) dan batas bulan.
*/

/*
| Satuan periode. Teks Inggris di sini adalah **fallback**, sama seperti
| seluruh pemanggil `translate()` di repo ini: kunci yang belum ada
| menghasilkan layar seperti sebelum i18n dipasang, bukan kunci mentah.
*/
const PERIOD_MODE_FALLBACK: Record<DashboardPeriodMode, string> = {
  day: "Daily",
  week: "Weekly",
  month: "Monthly",
  quarter: "Quarterly",
  year: "Yearly",
  custom: "Custom",
}

/*
| Nama deret/irisan chart menurut bahasa aktif.
|
| Yang diterjemahkan **hanya kode kanonik** yang dikirim backend
| (`present`, `late`, `ot_regular`). Tanpa kode, label dari API dipakai
| apa adanya — mencocokkan teksnya ("Hadir" → "Present") berarti
| menerjemahkan nama departemen dan nama tipe cuti milik tenant begitu
| salah satunya kebetulan sama bunyinya.
|
| Urutannya: katalog deret, lalu katalog status bersama (`present`,
| `late`, `absent` sudah ada di sana), lalu label API.
*/
export function seriesLabel(
  code: string | null | undefined,
  label?: string | null,
): string {
  const fallback = label ?? code ?? ""

  if (!code) return fallback

  const own = translate(`common.series.${code}`, "")

  if (own) return own

  return translate(`common.status.${code}`, fallback)
}

export function periodModeLabel(mode: DashboardPeriodMode): string {
  return translate(
    `common.period.modes.${mode}`,
    PERIOD_MODE_FALLBACK[mode] ?? mode,
  )
}

const ROMAN_QUARTER = ["I", "II", "III", "IV"]

export function toISODate(value: Date): string {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, "0")
  const day = String(value.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

/**
 * Tanggal lokal, bukan UTC. `new Date("2026-08-08")` di JS dibaca
 * sebagai tengah malam UTC — di WIB itu jatuh ke tanggal 8 pukul 07:00,
 * tapi di zona barat justru mundur ke tanggal 7.
 */
export function fromISODate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number)

  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1)
}

export function todayISO(): string {
  return toISODate(new Date())
}

function addDays(value: Date, days: number): Date {
  const next = new Date(value)

  next.setDate(next.getDate() + days)

  return next
}

function addMonths(value: Date, months: number): Date {
  const target = new Date(value.getFullYear(), value.getMonth() + months, 1)
  const lastDay = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0,
  ).getDate()

  return new Date(
    target.getFullYear(),
    target.getMonth(),
    Math.min(value.getDate(), lastDay),
  )
}

// Senin sebagai awal minggu, mengikuti kalender kerja di Indonesia.
function startOfWeek(value: Date): Date {
  const weekday = (value.getDay() + 6) % 7

  return addDays(value, -weekday)
}

export function daysBetween(start: string, end: string): number {
  const from = fromISODate(start).getTime()
  const to = fromISODate(end).getTime()

  return Math.round((to - from) / 86_400_000) + 1
}

/** Rentang untuk satu mode, berjangkar pada satu tanggal. */
export function rangeForMode(
  mode: DashboardPeriodMode,
  anchor: Date | string,
): { start: string, end: string } {
  const date = typeof anchor === "string" ? fromISODate(anchor) : anchor

  if (mode === "day") {
    return { start: toISODate(date), end: toISODate(date) }
  }

  if (mode === "week") {
    const start = startOfWeek(date)

    return { start: toISODate(start), end: toISODate(addDays(start, 6)) }
  }

  if (mode === "quarter") {
    const index = Math.floor(date.getMonth() / 3)
    const start = new Date(date.getFullYear(), index * 3, 1)
    const end = new Date(date.getFullYear(), index * 3 + 3, 0)

    return { start: toISODate(start), end: toISODate(end) }
  }

  if (mode === "year") {
    return {
      start: toISODate(new Date(date.getFullYear(), 0, 1)),
      end: toISODate(new Date(date.getFullYear(), 11, 31)),
    }
  }

  return {
    start: toISODate(new Date(date.getFullYear(), date.getMonth(), 1)),
    end: toISODate(new Date(date.getFullYear(), date.getMonth() + 1, 0)),
  }
}

export function periodForMode(
  mode: DashboardPeriodMode,
  anchor: Date | string = new Date(),
): DashboardPeriodState {
  if (mode === "custom") {
    const date = typeof anchor === "string" ? fromISODate(anchor) : anchor

    // "Kustom" tanpa rentang belum berarti apa-apa; 30 hari terakhir
    // dipakai sebagai titik awal yang bisa langsung digeser user.
    return {
      mode,
      start: toISODate(addDays(date, -29)),
      end: toISODate(date),
    }
  }

  return { mode, ...rangeForMode(mode, anchor) }
}

/** Geser satu langkah ke periode sebelumnya (-1) atau berikutnya (+1). */
export function shiftPeriod(
  period: DashboardPeriodState,
  direction: number,
): DashboardPeriodState {
  const start = fromISODate(period.start)

  if (period.mode === "day") {
    return periodForMode("day", addDays(start, direction))
  }

  if (period.mode === "week") {
    return periodForMode("week", addDays(start, direction * 7))
  }

  if (period.mode === "month") {
    return periodForMode("month", addMonths(start, direction))
  }

  if (period.mode === "quarter") {
    return periodForMode("quarter", addMonths(start, direction * 3))
  }

  if (period.mode === "year") {
    return periodForMode(
      "year",
      new Date(start.getFullYear() + direction, 0, 1),
    )
  }

  // Rentang bebas digeser sepanjang rentangnya sendiri, jadi tombol
  // panah tetap terasa konsisten dengan mode lain.
  const span = daysBetween(period.start, period.end)

  return {
    mode: "custom",
    start: toISODate(addDays(start, direction * span)),
    end: toISODate(addDays(fromISODate(period.end), direction * span)),
  }
}

/** Label periode yang tampil di tombol filter. */
export function periodRangeLabel(period: DashboardPeriodState): string {
  const start = fromISODate(period.start)
  const end = fromISODate(period.end)

  if (period.mode === "day") {
    return `${start.getDate()} ${monthLabel(start.getMonth() + 1)} ${start.getFullYear()}`
  }

  if (period.mode === "month") {
    return `${monthLabel(start.getMonth() + 1)} ${start.getFullYear()}`
  }

  if (period.mode === "quarter") {
    const index = Math.floor(start.getMonth() / 3)

    return translate(
      "common.period.quarterLabel",
      `Quarter ${ROMAN_QUARTER[index]} ${start.getFullYear()}`,
      { quarter: ROMAN_QUARTER[index], year: start.getFullYear() },
    )
  }

  if (period.mode === "year") {
    return String(start.getFullYear())
  }

  if (start.getFullYear() !== end.getFullYear()) {
    return (
      `${start.getDate()} ${monthAbbr(start.getMonth() + 1)} ${start.getFullYear()} – `
      + `${end.getDate()} ${monthAbbr(end.getMonth() + 1)} ${end.getFullYear()}`
    )
  }

  if (start.getMonth() !== end.getMonth()) {
    return (
      `${start.getDate()} ${monthAbbr(start.getMonth() + 1)} – `
      + `${end.getDate()} ${monthAbbr(end.getMonth() + 1)} ${end.getFullYear()}`
    )
  }

  if (period.start === period.end) {
    return `${start.getDate()} ${monthLabel(start.getMonth() + 1)} ${start.getFullYear()}`
  }

  return (
    `${start.getDate()} – ${end.getDate()} `
    + `${monthLabel(start.getMonth() + 1)} ${start.getFullYear()}`
  )
}

export interface DashboardPeriodPreset {
  key: string
  /** Kunci katalog; `label` dipakai kalau kuncinya belum ada. */
  labelKey: string
  label: string
  build: () => DashboardPeriodState
}

/** Nama pintasan menurut bahasa aktif. */
export function presetLabel(preset: DashboardPeriodPreset): string {
  return translate(preset.labelKey, preset.label)
}

/**
 * Pintasan yang paling sering dipakai. Semuanya menghasilkan rentang
 * "kustom" kecuali hari ini / bulan ini, supaya modenya tetap jujur
 * terhadap apa yang dipilih.
 */
export const PERIOD_PRESETS: DashboardPeriodPreset[] = [
  {
    key: "today",
    labelKey: "common.period.today",
    label: "Today",
    build: () => periodForMode("day"),
  },
  {
    key: "this-week",
    labelKey: "common.period.this_week",
    label: "This Week",
    build: () => periodForMode("week"),
  },
  {
    key: "last-7",
    labelKey: "common.period.last_7_days",
    label: "Last 7 Days",
    build: () => ({
      mode: "custom",
      start: toISODate(addDays(new Date(), -6)),
      end: todayISO(),
    }),
  },
  {
    key: "last-30",
    labelKey: "common.period.last_30_days",
    label: "Last 30 Days",
    build: () => ({
      mode: "custom",
      start: toISODate(addDays(new Date(), -29)),
      end: todayISO(),
    }),
  },
  {
    key: "this-month",
    labelKey: "common.period.this_month",
    label: "This Month",
    build: () => periodForMode("month"),
  },
  {
    key: "last-month",
    labelKey: "common.period.last_month",
    label: "Last Month",
    build: () => periodForMode("month", addMonths(new Date(), -1)),
  },
  {
    key: "this-quarter",
    labelKey: "common.period.this_quarter",
    label: "This Quarter",
    build: () => periodForMode("quarter"),
  },
  {
    key: "this-year",
    labelKey: "common.period.this_year",
    label: "This Year",
    build: () => periodForMode("year"),
  },
]

function decimals(value: number, precision?: number): number {
  if (precision != null) return precision

  // Angka bulat tidak perlu ",0" di belakangnya; pecahan cukup satu
  // desimal supaya kartu KPI tidak melebar.
  return Number.isInteger(value) ? 0 : 1
}

function localeNumber(value: number, precision?: number): string {
  const digits = decimals(value, precision)

  // Mengikuti bahasa aktif, bukan "id-ID" mati. Presisi yang diminta
  // pemanggil diteruskan apa adanya — yang berubah hanya pemisah
  // ribuan dan desimalnya.
  return formatLocaleNumber(value, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

/**
 * Nilai null dirender sebagai "—", bukan 0.
 *
 * Backend mengirim null kalau periodenya memang belum punya data
 * (mis. rata-rata kehadiran bulan yang belum berjalan). Menampilkan 0
 * di situ terbaca sebagai "kehadiran nol persen".
 */
export function formatDashboardValue(
  value: unknown,
  format: DashboardFormat = "number",
  precision?: number,
): string {
  if (value == null || value === "") return "—"

  if (format === "text" || format === "status") return String(value)

  if (format === "datetime") {
    const date = new Date(String(value))

    if (Number.isNaN(date.getTime())) return String(value)

    return new Intl.DateTimeFormat(activeIntlLocale(), {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (format === "date") {
    const date = new Date(String(value))

    if (Number.isNaN(date.getTime())) return String(value)

    return new Intl.DateTimeFormat(activeIntlLocale(), {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  const numeric = Number(value)

  if (Number.isNaN(numeric)) return String(value)

  if (format === "percent") {
    return `${localeNumber(numeric, precision ?? 1)}%`
  }

  if (format === "currency") {
    // `currency: "IDR"` tetap IDR dan **tidak** diturunkan dari bahasa:
    // perusahaan yang membukukan dalam mata uang lain tidak berubah
    // mata uangnya karena antarmukanya diganti ke English.
    return formatLocaleNumber(numeric, {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: precision ?? 0,
    })
  }

  if (format === "duration") {
    const hours = Math.floor(numeric / 60)
    const minutes = Math.round(numeric % 60)

    return minutes ? `${hours}j ${minutes}m` : `${hours}j`
  }

  return localeNumber(numeric, precision)
}

/*
 * Label **sumbu**, bukan label nilai.
 *
 * Rupiah ditulis utuh di kartu KPI, tooltip, dan tabel — di situ
 * ketepatannya memang yang dicari. Di sumbu chart ia justru merusak
 * bacaannya: "Rp 20.000.000" selebar 110px, dan enam label sebanyak
 * itu pada kartu selebar setengah layar bertumpuk jadi
 * "Rp 20.000.0Rp 40.000.0Rp 6…" — deretan angka yang tidak satu pun
 * bisa dibaca.
 *
 * Yang dipendekkan cuma sumbu. Nilai tepatnya tetap muncul begitu
 * kursornya menyentuh titiknya.
 *
 * Satuannya Indonesia (rb / jt / M / T), bukan K/M/B: yang membaca
 * layar ini menulis "Rp 132 jt" di catatannya sendiri, dan "132M"
 * berarti miliar bagi sebagian pembacanya — kesalahan seribu kali
 * lipat yang tidak berbunyi.
 */
const COMPACT_UNITS: [number, string][] = [
  [1e12, "T"],
  [1e9, "M"],
  [1e6, "jt"],
  [1e3, "rb"],
]

export function formatDashboardAxis(
  value: unknown,
  format: DashboardFormat = "number",
): string {
  if (format !== "currency") return formatDashboardValue(value, format)

  if (value == null || value === "") return "—"

  const numeric = Number(value)

  if (Number.isNaN(numeric)) return String(value)

  const magnitude = Math.abs(numeric)

  for (const [scale, unit] of COMPACT_UNITS) {
    if (magnitude < scale) continue

    const scaled = numeric / scale

    // Satu desimal hanya kalau ia menambah informasi: "Rp 1,5 jt"
    // berguna, "Rp 20,0 jt" cuma lebih panjang.
    const digits = Math.abs(scaled) < 10 && !Number.isInteger(scaled) ? 1 : 0

    return `Rp ${localeNumber(scaled, digits)} ${unit}`
  }

  return `Rp ${localeNumber(numeric, 0)}`
}

/**
 * `span` dari backend memakai grid 12 kolom. Tailwind tidak bisa
 * menerima kelas yang dirakit saat runtime (`col-span-${n}` akan
 * ter-purge), jadi pemetaannya ditulis penuh di sini.
 *
 * Di `md` (tablet) hanya **6** yang berbagi baris. Alasannya bukan
 * selera: kartu span 8 dan 10 sudah penuh selebar baris di sana, jadi
 * kartu span 1–5 yang berdiri di sebelahnya tidak pernah dapat
 * pasangan — ia mengambil setengah baris dan menyisakan setengahnya
 * kosong. Di laporan HR Period Summary polanya 8-4-8-4, dan hasilnya
 * dua baris yang separuhnya melompong; yang terlihat bukan "kartunya
 * memang sedikit", melainkan tata letak yang rusak.
 *
 * Span 6 tetap berbagi baris karena 6+6 memang selalu berpasangan pas.
 * Sisanya penuh di tablet, lalu grid dua belas kolomnya baru berlaku
 * dari `xl`.
 */
const SPAN_CLASS: Record<number, string> = {
  1: "md:col-span-12 xl:col-span-1",
  2: "md:col-span-12 xl:col-span-2",
  3: "md:col-span-12 xl:col-span-3",
  4: "md:col-span-12 xl:col-span-4",
  5: "md:col-span-12 xl:col-span-5",
  6: "md:col-span-6 xl:col-span-6",
  7: "md:col-span-12 xl:col-span-7",
  8: "md:col-span-12 xl:col-span-8",
  9: "md:col-span-12 xl:col-span-9",
  10: "md:col-span-12 xl:col-span-10",
  11: "md:col-span-12 xl:col-span-11",
  12: "md:col-span-12 xl:col-span-12",
}

export function spanClass(span?: number): string {
  return SPAN_CLASS[span ?? 12] ?? SPAN_CLASS[12]!
}

/*
 * Baris kartu KPI, jumlah kolomnya mengikuti **jumlah kartunya**.
 *
 * Sebelumnya barisnya selalu `xl:grid-cols-6`, dan itu benar selama
 * setiap dashboard kebetulan punya persis enam kartu — HR Dashboard,
 * Administration Dashboard, dan HR Period Summary semuanya begitu.
 * Manpower Summary yang pertama tidak: empat kartu di grid enam kolom
 * meninggalkan dua sel kosong di ujung kanan, dan ruang kosong di
 * sebelah kartu terakhir terbaca sebagai kartu yang gagal dimuat,
 * bukan sebagai kartu yang memang cuma empat.
 *
 * Enam ke atas mengembalikan kelas yang sama persis dengan sebelumnya,
 * jadi tidak satu pun dashboard yang sudah ada bergeser tampilannya.
 * Kelasnya ditulis penuh — Tailwind memindai sumber apa adanya dan
 * `grid-cols-${n}` yang dirakit saat runtime akan ter-purge.
 */
const STAT_GRID_CLASS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
}

const STAT_GRID_DEFAULT = "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"

export function statGridClass(count: number): string {
  return STAT_GRID_CLASS[count] ?? STAT_GRID_DEFAULT
}
