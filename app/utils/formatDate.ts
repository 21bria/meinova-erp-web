// utils/formatDate.ts

import { fromISODate } from "@framework/core/utils/dashboard"
import { isISODate } from "@framework/core/utils/date"

const DEFAULT_LOCALE = "id-ID"
const DEFAULT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

/*
| `new Date("2026-09-25")` dibaca JS sebagai tengah malam **UTC**, lalu
| `getDate()` membacanya kembali di zona perangkat. Di zona yang di
| belakang UTC itu mundur sehari: tanggal yang tersimpan `2026-09-25`
| tampil `24-09-2026` di tabel, sementara form di sebelahnya
| menampilkan 25. Tidak ada error, cuma dua tanggal untuk satu nilai.
|
| Tanggal tanpa jam karena itu dirakit dari komponennya sebagai tengah
| malam **lokal** — `2026-09-25` tetap 25 September di zona mana pun.
|
| Yang membawa jam (`2026-09-25T07:00:00Z`) sengaja tidak disentuh:
| zonanya memang bagian dari nilainya, dan mengubah penafsirannya di
| sini akan menggeser jam di layar yang tidak sedang dibahas.
*/
function parse(value?: string | Date | null) {
  if (!value)
    return null

  if (typeof value === "string" && isISODate(value))
    return fromISODate(value)

  const date = value instanceof Date
    ? value
    : new Date(value)

  return Number.isNaN(date.getTime())
    ? null
    : date
}

// export function formatDate(
//   value?: string | Date | null,
// ) {
//   const date = parse(value)

//   if (!date)
//     return "-"

//   return new Intl.DateTimeFormat(
//     DEFAULT_LOCALE,
//     {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       timeZone: DEFAULT_TIMEZONE,
//     },
//   ).format(date)
// }

// export function formatDateTime(
//   value?: string | Date | null,
// ) {
//   const date = parse(value)

//   if (!date)
//     return "-"

//   return new Intl.DateTimeFormat(
//     DEFAULT_LOCALE,
//     {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//       timeZone: DEFAULT_TIMEZONE,
//     },
//   ).format(date)
// }

export function formatDate(
  value?: string | Date | null,
) {
  const date = parse(value)

  if (!date)
    return "-"

  const day = String(
    date.getDate(),
  ).padStart(2, "0")

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0")

  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

export function formatDateTime(
  value?: string | Date | null,
) {
  const date = parse(value)

  if (!date)
    return "-"

  const day = String(
    date.getDate(),
  ).padStart(2, "0")

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0")

  const year = date.getFullYear()

  const hour = String(
    date.getHours(),
  ).padStart(2, "0")

  const minute = String(
    date.getMinutes(),
  ).padStart(2, "0")

  return `${day}-${month}-${year} ${hour}:${minute}`
}