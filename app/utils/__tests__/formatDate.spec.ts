/*
| Yang diuji di sini satu hal saja, dan itu hal yang gagalnya paling
| tidak terlihat:
|
|     2026-09-25 harus tampil 25 September di zona waktu mana pun.
|
| `new Date("2026-09-25")` dibaca JS sebagai tengah malam **UTC**. Di
| zona yang di belakang UTC, `getDate()` mengembalikannya sebagai
| tanggal 24 — jadi tabel menampilkan `24-09-2026` untuk baris yang
| kolom formnya menampilkan `25.09.26`. Tidak ada satu pun error yang
| menyertainya; yang membacanya cuma menyimpulkan datanya salah.
|
| Zonanya digeser lewat `process.env.TZ` **sebelum** modulnya diimpor,
| karena Node mengunci zona saat pertama kali dibutuhkan.
*/
import { afterEach, describe, expect, it, vi } from 'vitest'

const ORIGINAL_TZ = process.env.TZ

afterEach(() => {
  process.env.TZ = ORIGINAL_TZ
  vi.resetModules()
})

async function inTimeZone(tz: string) {
  process.env.TZ = tz
  vi.resetModules()

  return import('../formatDate')
}

/* Dua zona di sisi berlawanan dari garis tanggal, plus zona proyek. */
const ZONES = ['UTC', 'Asia/Jakarta', 'Pacific/Kiritimati', 'Pacific/Midway', 'America/Los_Angeles']

describe('formatDate — tanggal tanpa jam', () => {
  it.each(ZONES)('2026-09-25 tetap 25 September di %s', async (tz) => {
    const { formatDate } = await inTimeZone(tz)

    expect(formatDate('2026-09-25')).toBe('25-09-2026')
  })

  it.each(ZONES)('tanggal 1 tidak mundur ke bulan sebelumnya di %s', async (tz) => {
    const { formatDate } = await inTimeZone(tz)

    expect(formatDate('2026-01-01')).toBe('01-01-2026')
    expect(formatDate('2026-03-01')).toBe('01-03-2026')
  })

  it('kosong tetap strip', async () => {
    const { formatDate } = await inTimeZone('UTC')

    expect(formatDate(null)).toBe('-')
    expect(formatDate(undefined)).toBe('-')
    expect(formatDate('')).toBe('-')
  })

  it('tanggal yang tidak ada di kalender tidak dipoles menjadi tanggal lain', async () => {
    const { formatDate } = await inTimeZone('UTC')

    // `2026-02-30` bukan tanggal. Yang penting di sini bukan bunyi
    // hasilnya melainkan bahwa ia tidak lewat jalur tanggal-tanpa-jam
    // dan menjadi "02-03-2026" yang terlihat sah.
    expect(formatDate('2026-02-30')).not.toBe('30-02-2026')
  })
})

/*
| Cakupan: yang membawa jam sengaja TIDAK ikut berubah. Zona memang
| bagian dari nilainya, dan menggesernya di sini akan memindahkan jam
| di layar yang tidak sedang dibahas.
*/
describe('formatDateTime — tidak ikut disentuh', () => {
  it('datetime tetap ditafsirkan menurut zona perangkat', async () => {
    const jakarta = await inTimeZone('Asia/Jakarta')

    expect(jakarta.formatDateTime('2026-09-25T00:00:00Z')).toBe('25-09-2026 07:00')

    const utc = await inTimeZone('UTC')

    expect(utc.formatDateTime('2026-09-25T00:00:00Z')).toBe('25-09-2026 00:00')
  })

  it('formatDate atas nilai bertimestamp tetap memakai zona perangkat', async () => {
    const jakarta = await inTimeZone('Asia/Jakarta')

    // 24 September 20:00 UTC adalah 25 September di Jakarta. Perilaku
    // lama, sengaja dipertahankan.
    expect(jakarta.formatDate('2026-09-24T20:00:00Z')).toBe('25-09-2026')
  })
})
