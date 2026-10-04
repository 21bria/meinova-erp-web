import { describe, expect, it } from 'vitest'

import en from '../../../i18n/locales/en/me'
import id from '../../../i18n/locales/id/me'
import { checkInAction, withCheckIn } from '../workspace/quickActions'

/*
| Aksi cepat Absen Masuk (ATT-GPS-1A): diturunkan dari aksi kartu
| Kehadiran yang sudah diresolusi backend, menunjuk halaman tap kanonik,
| dan tidak membawa kebijakan tap sendiri.
*/

const attendance = { code: 'attendance', route: '/me/attendance' }

const backend = [
  { code: 'profile', route: '/me/profile' },
  { code: 'leave_request', route: '/hr/leave/create' },
  { code: 'permission_request', route: '/hr/attendance-permissions/create' },
]

describe('check-in quick action', () => {
  it('sits right after My Profile and opens the dedicated punch page', () => {
    expect(withCheckIn(backend, attendance, true).map(action => action.code)).toEqual([
      'profile',
      'check_in',
      'leave_request',
      'permission_request',
    ])

    expect(checkInAction(attendance)).toEqual({
      code: 'check_in',
      route: '/me/attendance/punch',
    })
  })

  it('is distinct from View Attendance, which stays on the report', () => {
    // Kartu Kehadiran memakai aksi backend apa adanya (`/me/attendance`);
    // Absen Masuk membuka halaman aksi — dua perjalanan berbeda.
    expect(checkInAction(attendance)?.route).not.toBe(attendance.route)
    expect(attendance.route).toBe('/me/attendance')
  })

  it('does not appear when the backend gives no attendance action', () => {
    expect(withCheckIn(backend, null, true)).toBe(backend)
    expect(withCheckIn(backend, undefined, true)).toBe(backend)
    expect(withCheckIn(backend, { code: 'attendance', route: '' }, true)).toBe(backend)
  })

  it('does not appear when the backend says punching is unavailable', () => {
    // Bawaan produksi: tap mati / wajah-liveness belum terpasang. Absen
    // Masuk tidak boleh membawa pegawai ke halaman tanpa tombol absen.
    expect(withCheckIn(backend, attendance, false)).toBe(backend)
  })

  it('goes first when there is no profile action', () => {
    expect(withCheckIn(backend.slice(1), attendance, true)[0]?.code).toBe('check_in')
    expect(withCheckIn([], attendance, true).map(action => action.code)).toEqual(['check_in'])
  })

  it('is never duplicated if the backend sends it later', () => {
    const already = [...backend, { code: 'check_in', route: '/me/attendance/punch' }]

    expect(withCheckIn(already, attendance, true)).toBe(already)
  })

  it('does not mutate the backend list', () => {
    const copy = structuredClone(backend)

    withCheckIn(backend, attendance, true)

    expect(backend).toEqual(copy)
  })

  it('has EN and ID labels', () => {
    expect(en.actions.check_in).toBe('Check In')
    expect(id.actions.check_in).toBe('Absen Masuk')
  })
})
