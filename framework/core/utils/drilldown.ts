// framework/core/utils/drilldown.ts

/*
| Penyajian dialog rincian (drill-down) dashboard.
|
| **Hanya memformat.** Setiap angka di sini datang dari backend apa
| adanya: menit telat (`duration_minutes`) sudah dipotong toleransi oleh
| `AttendancePolicyResolver`, jadi "08:00 → 08:27" boleh bertuliskan
| 12m, dan itu yang benar. Tidak ada fungsi di berkas ini yang
| mengurangkan dua jam, menjumlahkan ulang hari, atau memutuskan apakah
| sebuah baris terlambat.
|
| Kode (`source_code`, `detail_kind`, `aggregate.unit`) tidak pernah
| diubah — yang diterjemahkan hanya tampilannya.
*/

import type {
  DashboardDrilldownData,
  DashboardDrilldownItem,
  DashboardDrilldownSource,
} from "../types/dashboard"

import {
  activeIntlLocale,
  formatLocaleNumber,
  statusLabel,
  translate,
} from "./i18n"

const NS = "common.drilldown"

/**
 * Nilai nol (atau kosong) tidak membuka dialog: "0" sudah jawaban
 * lengkapnya, dan dialog kosong terbaca seperti rincian yang gagal.
 */
export function isDrillable(
  column: { drilldown?: string | null },
  value: unknown,
): boolean {
  if (!column.drilldown || value == null || value === "") return false

  const numeric = Number(value)

  return !Number.isNaN(numeric) && numeric !== 0
}

function t(key: string, fallback: string, params?: Record<string, unknown>) {
  if (!params) return translate(`${NS}.${key}`, fallback)

  // Fallback Inggris ikut diinterpolasi supaya klien tanpa katalog
  // tetap membaca kalimat utuh, bukan "{count} occurrences".
  const filled = fallback.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ""))

  return translate(`${NS}.${key}`, filled, params)
}

const SOURCE_FALLBACK: Record<DashboardDrilldownSource, string> = {
  attendance: "Attendance",
  leave: "Leave",
  overtime: "Overtime",
  roster: "Roster Schedule",
}

export function drilldownSourceLabel(
  code: string | null | undefined,
  legacy?: string | null,
): string {
  if (!code) return legacy ?? ""

  const fallback = SOURCE_FALLBACK[code as DashboardDrilldownSource] ?? legacy ?? code

  return t(`sources.${code}`, fallback)
}

/**
 * 27 → "27m", 75 → "1h 15m", 390 → "6h 30m" (id: "6j 30m").
 * `null` = durasi tidak terbukti → "—", bukan "0m".
 */
export function formatDuration(minutes: number | null | undefined): string {
  if (minutes == null || Number.isNaN(Number(minutes))) return "—"

  const total = Math.max(0, Math.round(Number(minutes)))
  const h = Math.floor(total / 60)
  const m = total % 60

  if (!h) return t("duration.minutes", "{m}m", { m })
  if (!m) return t("duration.hours", "{h}h", { h })

  return t("duration.hoursMinutes", "{h}h {m}m", { h, m })
}

/** Tanggal ISO `YYYY-MM-DD` tanpa pergeseran zona. */
export function formatDrilldownDate(value: string | null | undefined): string {
  if (!value) return "—"

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value))

  if (!match) return String(value)

  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))

  return new Intl.DateTimeFormat(activeIntlLocale(), {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}

function formatNumber(value: number): string {
  return formatLocaleNumber(value, { maximumFractionDigits: 2 })
}

function counted(key: "occurrence" | "day" | "record", count: number): string {
  const one = count === 1
  const fallbacks = {
    occurrence: one ? "{count} occurrence" : "{count} occurrences",
    day: one ? "{count} day" : "{count} days",
    record: one ? "{count} record" : "{count} records",
  }

  return t(
    `summary.${key}${one ? "" : "s"}`,
    fallbacks[key],
    { count: formatNumber(count) },
  )
}

/**
 * Subjudul dialog, mis.
 *   en: "4 occurrences · total 2h 15m · source Attendance"
 *   id: "4 kejadian · total 2j 15m · sumber Kehadiran"
 *
 * Kejadian dan durasi disebut **berdampingan**, tidak saling mengganti.
 */
export function drilldownSummary(detail: DashboardDrilldownData): string {
  const parts: string[] = []
  const items = detail.count ?? detail.items?.length ?? 0
  const unit = detail.aggregate?.unit
  const value = detail.aggregate?.value ?? detail.total

  if (unit === "occurrence") {
    parts.push(counted("occurrence", detail.occurrences ?? items))
  }
  else if (unit === "day" || (!unit && detail.unit === "days")) {
    parts.push(counted("day", value))

    // Cuti setengah hari: 2,5 hari dari 3 catatan. Tanpa ini
    // selisihnya terbaca seperti rincian yang hilang.
    if (items !== value) parts.push(counted("record", items))
  }
  else {
    parts.push(counted("record", items))
  }

  if (detail.duration_minutes != null) {
    const duration = formatDuration(detail.duration_minutes)

    parts.push(
      unit === "hour"
        ? t("summary.totalHours", "total {duration} = {hours}h", {
            duration,
            hours: formatNumber(value),
          })
        : t("summary.total", "total {duration}", { duration }),
    )

    if (detail.duration_complete === false) {
      const missing = (detail.items ?? []).filter(item => item.duration_minutes == null).length

      parts.push(
        t("summary.missingDuration", "{count} without recorded duration", {
          count: formatNumber(missing),
        }),
      )
    }
  }
  else if (unit === "hour" || (!unit && detail.unit === "hours")) {
    // Backend lama: belum ada menit, hanya jam.
    parts.push(t("summary.totalHours", "total {duration} = {hours}h", {
      duration: formatDuration(value * 60),
      hours: formatNumber(value),
    }))
  }

  const source = drilldownSourceLabel(detail.source_code, detail.source)

  if (source) parts.push(t("summary.source", "source {source}", { source }))

  return parts.join(" · ")
}

export interface DrilldownColumn {
  key: string
  label: string
  align: "left" | "right"
  muted?: boolean
  cell: (item: DashboardDrilldownItem) => string
  note?: (item: DashboardDrilldownItem) => string
}

function column(
  key: string,
  fallback: string,
  cell: DrilldownColumn["cell"],
  extra: Partial<DrilldownColumn> = {},
): DrilldownColumn {
  return {
    key,
    label: t(`columns.${key}`, fallback),
    align: "left",
    cell,
    ...extra,
  }
}

const dash = (value: unknown) => (value == null || value === "" ? "—" : String(value))

function excusedNote(item: DashboardDrilldownItem): string {
  return item.excused_minutes
    ? t("excused", "{duration} excused", { duration: formatDuration(item.excused_minutes) })
    : ""
}

function sourceCell(item: DashboardDrilldownItem): string {
  return drilldownSourceLabel(item.source_code) || "—"
}

function attendanceStatus(item: DashboardDrilldownItem): string {
  if (!item.record_id) return t("noRecord", "No attendance record")

  return statusLabel(item.status) || "—"
}

/**
 * Kolom dialog per `detail_kind` dari backend. Backend lama (tanpa
 * `detail_kind`) mendapat empat kolom yang sama seperti sebelumnya.
 */
export function drilldownColumns(detail: DashboardDrilldownData): DrilldownColumn[] {
  const date = column("date", "Date", item => formatDrilldownDate(item.date))

  switch (detail.detail_kind) {
    case "late":
    case "early": {
      const late = detail.detail_kind === "late"

      return [
        date,
        column(late ? "scheduled_in" : "scheduled_out", late ? "Scheduled Clock-in" : "Scheduled Clock-out", item => dash(item.scheduled_time)),
        column(late ? "actual_in" : "actual_out", late ? "Actual Clock-in" : "Actual Clock-out", item => dash(item.actual_time)),
        column(
          late ? "late_duration" : "early_duration",
          late ? "Late Duration" : "Early Leave Duration",
          item => formatDuration(item.duration_minutes),
          { align: "right", note: excusedNote },
        ),
        column("source", "Source", sourceCell, { muted: true }),
      ]
    }

    case "overtime":
      return [
        date,
        column("start", "Start", item => dash(item.start_time)),
        column("end", "End", item => dash(item.end_time)),
        column("duration", "Duration", item => formatDuration(item.duration_minutes), { align: "right" }),
        column("overtime_type", "Overtime Type", item => dash(item.detail)),
        column("reason", "Reason", item => dash(item.reason ?? item.reference), { muted: true }),
      ]

    case "leave":
      return [
        date,
        column("leave_type", "Leave Type", item => dash(item.detail)),
        column("date_range", "Leave Period", (item) => {
          if (!item.range_start) return "—"
          if (item.range_start === item.range_end) return formatDrilldownDate(item.range_start)

          return `${formatDrilldownDate(item.range_start)} – ${formatDrilldownDate(item.range_end)}`
        }),
        column("quantity", "Days", item => formatNumber(item.quantity ?? item.value), { align: "right" }),
        column("document", "Document No.", item => dash(item.reference), { muted: true }),
        column("status", "Status", item => (item.status ? statusLabel(item.status) : "—")),
      ]

    case "attendance_day":
      return [
        date,
        column("status", "Status", attendanceStatus),
        column("clock_in", "Clock-in", item => dash(item.start_time)),
        column("clock_out", "Clock-out", item => dash(item.end_time)),
        column("worked_duration", "Worked Duration", item => formatDuration(item.duration_minutes), { align: "right" }),
        column("source", "Source", sourceCell, { muted: true }),
      ]

    case "roster":
      return [date, column("source", "Source", sourceCell, { muted: true })]

    default:
      return [
        date,
        column("description", "Description", item => dash(item.detail)),
        column("reference", "Reference", item => dash(item.reference), { muted: true }),
        column("value", "Value", item => String(item.value), { align: "right" }),
      ]
  }
}
