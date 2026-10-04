/*
|--------------------------------------------------------------------------
| Preset rentang Kehadiran Saya
|--------------------------------------------------------------------------
|
| Aritmetika tanggal, **bukan aturan bisnis.** "Bulan lalu" berarti
| tanggal 1 sampai tanggal terakhir bulan sebelumnya di mana pun di
| dunia; yang butuh kalender kerja, roster, dan hari libur adalah
| pertanyaan "hari itu saya seharusnya masuk atau tidak", dan itu
| dijawab backend.
|
| Dipisah dari komponennya supaya bisa diuji: repo ini menjalankan
| vitest di lingkungan `node` tanpa DOM, jadi apa pun yang tinggal di
| dalam `<template>` tidak pernah tersentuh satu test pun. Dan yang
| paling gampang salah diam-diam di sini justru dua hal yang tidak
| menimbulkan error sama sekali — bulan Januari yang mundur ke bulan
| ke-nol, dan tanggal 31 yang digeser ke bulan yang cuma punya 30 hari.
*/

import type { SelfDateRange } from '../types'

/**
 * Kode preset. `custom` tidak menghitung apa-apa — ia menandai bahwa
 * rentangnya datang dari pemilih tanggal, bukan dari tombol.
 */
export type PresetCode
  = | 'last7'
    | 'last14'
    | 'last30'
    | 'thisMonth'
    | 'lastMonth'
    | 'custom'

export const PRESETS: readonly PresetCode[] = [
  'last7',
  'last14',
  'last30',
  'thisMonth',
  'lastMonth',
  'custom',
] as const

/**
 * `Date` → `YYYY-MM-DD` **lokal**.
 *
 * Bukan `toISOString()`: itu mengubah ke UTC lebih dulu, jadi pukul
 * 00:30 WIB tanggal 1 September dikirim sebagai 31 Agustus. Pergeseran
 * itu tidak pernah melempar apa pun — yang terjadi cuma rentangnya
 * meleset sehari, dan hanya bagi orang yang membukanya dini hari.
 */
export function toISO(value: Date): string {
  const year = String(value.getFullYear()).padStart(4, '0')
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function shift(from: Date, days: number): Date {
  const result = new Date(from)

  result.setDate(result.getDate() + days)

  return result
}

/**
 * Rentang sebuah preset, dihitung terhadap `today`.
 *
 * `today` diterima sebagai argumen alih-alih dibaca dari `new Date()` di
 * dalam: fungsi yang membaca jam sendiri hanya bisa diuji pada hari
 * pengujiannya, dan test yang hijau cuma bulan ini bukan test.
 *
 * `custom` mengembalikan `null` — pemanggilnya yang memegang tanggal
 * pilihan pengguna, dan menebakkannya di sini berarti menekan "Kustom"
 * diam-diam mengubah rentang yang sedang dilihat.
 */
export function presetRange(
  code: PresetCode,
  today: Date = new Date(),
): SelfDateRange | null {
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  switch (code) {
    case 'last7':
      return { date_from: toISO(shift(end, -6)), date_to: toISO(end) }

    case 'last14':
      return { date_from: toISO(shift(end, -13)), date_to: toISO(end) }

    case 'last30':
      return { date_from: toISO(shift(end, -29)), date_to: toISO(end) }

    case 'thisMonth':
      return {
        date_from: toISO(new Date(end.getFullYear(), end.getMonth(), 1)),
        // Hari ini, bukan akhir bulan: presensi tanggal 30 belum ada
        // saat ini tanggal 3, dan rentang yang membentang ke masa depan
        // membuat "Tidak Hadir" menghitung hari yang belum terjadi.
        date_to: toISO(end),
      }

    case 'lastMonth': {
      // `new Date(y, m, 0)` = hari terakhir bulan `m - 1`. Satu-satunya
      // bentuk yang benar untuk Februari tanpa menuliskan aturan kabisat
      // sendiri.
      const first = new Date(end.getFullYear(), end.getMonth() - 1, 1)
      const last = new Date(end.getFullYear(), end.getMonth(), 0)

      return { date_from: toISO(first), date_to: toISO(last) }
    }

    case 'custom':
      return null
  }
}

/** Jumlah hari sebuah rentang, ujung-ke-ujung. */
export function rangeDays(range: SelfDateRange): number {
  const from = new Date(`${range.date_from}T00:00:00`)
  const to = new Date(`${range.date_to}T00:00:00`)

  return Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1
}

/**
 * Preset yang **persis** menghasilkan rentang ini, kalau ada.
 *
 * Dipakai supaya tombol yang aktif tetap benar sesudah halaman dimuat
 * ulang dengan rentang di URL, dan supaya menggeser periode dengan
 * panah melepaskan sorotan preset — periode 10–16 September yang
 * digeser mundur bukan lagi "7 Hari".
 */
export function matchPreset(
  range: SelfDateRange,
  today: Date = new Date(),
): PresetCode {
  for (const code of PRESETS) {
    const candidate = presetRange(code, today)

    if (
      candidate
      && candidate.date_from === range.date_from
      && candidate.date_to === range.date_to
    ) {
      return code
    }
  }

  return 'custom'
}
