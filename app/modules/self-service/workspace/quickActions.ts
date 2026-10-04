import type { SelfAction } from '../types'

import { PUNCH_ROUTE } from '../attendance/punch'

/*
| Aksi cepat **Absen Masuk** (ATT-GPS-1A).
|
| Bukan aksi baru dengan kebijakannya sendiri. Ia diturunkan dari aksi
| kartu Kehadiran yang **sudah diresolusi backend** (`attendance.action`
| — menu `/me/attendance` terlihat untuk akun ini). Kalau backend tidak
| memberi aksi itu, Absen Masuk juga tidak ada.
|
| Tujuannya halaman aksi `/me/attendance/punch`, **bukan** laporan
| `/me/attendance` (ATT-UX-1): absen dan melihat kehadiran adalah dua
| niat yang berbeda, dan "Lihat Kehadiran" di kartu Kehadiran tetap ke
| laporan.
|
| Dan hanya kalau tap memang **tersedia** untuk akun ini — jawaban
| `GET /api/me/attendance/punch/`, endpoint yang sama yang menentukan
| apakah formulir tap tampil di halaman tujuan (ATT-GPS-1B). Tanpa syarat
| ini, Absen Masuk di tenant yang tapnya mati membawa pegawai ke halaman
| tanpa tombol absen sama sekali. Dashboard tidak menebak kebijakannya;
| ia hanya mengikuti jawaban backend itu.
*/

export const CHECK_IN_CODE = 'check_in'

export function checkInAction(attendanceAction: SelfAction | null | undefined): SelfAction | null {
  if (!attendanceAction?.route)
    return null

  return { code: CHECK_IN_CODE, route: PUNCH_ROUTE }
}

/**
 * Aksi cepat dari backend + Absen Masuk tepat sesudah Profil Saya
 * (atau di depan kalau Profil tidak ada). Tidak menggandakan kalau
 * backend kelak mengirimnya sendiri.
 */
export function withCheckIn(
  actions: SelfAction[],
  attendanceAction: SelfAction | null | undefined,
  punchAvailable: boolean,
): SelfAction[] {
  const checkIn = punchAvailable ? checkInAction(attendanceAction) : null

  if (!checkIn || actions.some(action => action.code === CHECK_IN_CODE))
    return actions

  const profile = actions.findIndex(action => action.code === 'profile')
  const at = profile === -1 ? 0 : profile + 1

  return [...actions.slice(0, at), checkIn, ...actions.slice(at)]
}
