import type { ShiftCalendarAccess } from './types'

/*
 * "Jadwal Saya" — mode pribadi layar Shift Calendar.
 *
 * Satu layar, dua konteks:
 *
 *   My Workspace → Lihat Jadwal   /hr/shift-calendar?mode=my
 *   HR → Shift Calendar           /hr/shift-calendar
 *
 * `?mode=my` hanya **niat tampilan**. Ia tidak pernah membawa identitas
 * dan tidak pernah diteruskan ke backend: dalam mode pribadi kalender
 * diambil dari `/api/me/schedule/`, yang subjeknya diresolusi backend
 * dari akun yang login. Tidak ada `employee` di permintaannya — jadi
 * tidak ada id yang bisa diganti dari browser.
 *
 * Berkas ini murni (tanpa Vue, tanpa Nuxt) supaya aturannya bisa diuji
 * di lingkungan `node` milik vitest repo ini.
 */

export const SHIFT_CALENDAR_ENDPOINT = '/api/hr/shift-calendar/'
export const SELF_SCHEDULE_ENDPOINT = '/api/me/schedule/'

export const MY_MODE = 'my'

/** `?mode=my` dari query rute. Nilai lain — termasuk array — bukan mode pribadi. */
export function isMyModeQuery(query: Record<string, unknown>): boolean {
  return query?.mode === MY_MODE
}

export interface SelfModeState {
  /** Kalender yang ditampilkan milik akun ini sendiri, lewat `/api/me/schedule/`. */
  selfMode: boolean

  /**
   * Checkbox "Tampilkan Jadwal Saya" boleh dirender.
   *
   * Hanya untuk yang memang boleh melihat lebih dari satu kalender
   * (`selector_required`) **dan** punya kartu pegawai. Pegawai biasa
   * tidak mendapat checkbox — mode pribadinya tetap, tidak ada yang
   * bisa dimatikan. Ini kenyamanan tampilan, bukan penjagaan: endpoint
   * HR tetap menolak id di luar cakupannya.
   */
  toggleVisible: boolean
}

export function resolveSelfMode(
  requestedMy: boolean,
  access: ShiftCalendarAccess | null,
): SelfModeState {
  // Sebelum `access/` datang, niatnya dihormati apa adanya: layar yang
  // dibuka dari My Workspace tidak boleh sempat memuat kalender HR.
  if (!access)
    return { selfMode: requestedMy, toggleVisible: false }

  const toggleVisible
    = access.selector_required === true && access.self_employee != null

  // Tanpa checkbox, tidak ada cara keluar dari mode pribadi. Yang masuk
  // dari menu HR tanpa niat pribadi tetap mendapat perilaku lamanya
  // (`default_employee` lewat endpoint HR) — tidak diubah di sini.
  return { selfMode: requestedMy, toggleVisible }
}

export interface CalendarRequest {
  path: string
  query: Record<string, string | number>
}

/**
 * Permintaan kalender untuk keadaan layar saat ini, atau `null` kalau
 * belum ada yang bisa dimuat (mode HR tanpa pegawai terpilih).
 *
 * Mode pribadi **tidak pernah** menyertakan pegawai — sekalipun
 * `employeeId` masih berisi pilihan terakhir dari mode HR.
 */
export function calendarRequest(options: {
  selfMode: boolean
  employeeId: number | null
  month: string
}): CalendarRequest | null {
  if (options.selfMode) {
    return {
      path: SELF_SCHEDULE_ENDPOINT,
      query: { month: options.month },
    }
  }

  if (!options.employeeId)
    return null

  return {
    path: SHIFT_CALENDAR_ENDPOINT,
    query: { employee: options.employeeId, month: options.month },
  }
}

/**
 * Query rute baru setelah checkbox diubah. Parameter lain dipertahankan;
 * yang disentuh hanya `mode`.
 */
export function withMyMode<Q extends Record<string, unknown>>(
  query: Q,
  on: boolean,
): Q {
  const next: Record<string, unknown> = { ...query }

  if (on)
    next.mode = MY_MODE
  else
    delete next.mode

  return next as Q
}
