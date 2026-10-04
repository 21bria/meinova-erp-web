import type { Requester } from '../api/client'
import type { SelfAttendanceData } from '../types'

import { describe, expect, it, vi } from 'vitest'

import codesEn from '../../../i18n/locales/en/codes'
import commonEn from '../../../i18n/locales/en/common'
import en from '../../../i18n/locales/en/me'
import codesId from '../../../i18n/locales/id/codes'
import commonId from '../../../i18n/locales/id/common'
import id from '../../../i18n/locales/id/me'
import {
  attendanceQuery,
  fetchSelfAttendance,
  SELF_ENDPOINTS,
} from '../api/client'
import {
  matchPreset,
  presetRange,
  PRESETS,
  rangeDays,
  toISO,
} from '../attendance/presets'

/*
| Kehadiran Saya — lapisan data dan aritmetika tanggalnya.
|
| Yang tidak bisa diuji di sini: render komponen (vitest repo ini
| berjalan di `node`, tanpa DOM). Karena itu dua hal yang paling mudah
| salah diam-diam sengaja tinggal di luar `<template>`:
|
| 1. **Parameter apa yang benar-benar terkirim.** Kalau `employee`
|    pernah lolos ke query string, test di bawah yang memberitahu —
|    bukan pembacaan ulang komponen enam bulan lagi.
| 2. **Batas bulan.** Desember yang mundur ke bulan ke-nol dan 31
|    Januari yang digeser ke Februari tidak melempar apa pun; yang
|    terjadi cuma rentangnya meleset, dan hanya di bulan tertentu.
*/

function attendanceFixture(): SelfAttendanceData {
  return {
    range: {
      date_from: '2026-08-01',
      date_to: '2026-08-31',
      days: 31,
      max_days: 90,
      page_sizes: [10, 25, 50],
      previous: { date_from: '2026-07-01', date_to: '2026-07-31' },
      next: null,
    },
    summary: {
      work_days: { value: 20, available: true },
      present: { value: 18, available: true },
      late: { value: 5, available: true },
      absent: { value: 2, available: true },
      leave_days: { value: 0, available: true },
      worked_minutes: { value: 7864, available: true },
      overtime_minutes: { value: 0, available: true },
    },
    daily: [{ date: '2026-08-03', outcome: 'late' }],
    history: [],
  }
}

// ---------------------------------------------------------------------
// 1. Parameter yang terkirim
// ---------------------------------------------------------------------

describe('query string kehadiran', () => {
  it('tidak pernah mengirim parameter identitas', () => {
    /*
     * Ditulis sebagai daftar putih di `attendanceQuery()`, jadi kunci
     * asing **tidak bisa** lolos meski pemanggilnya menitipkannya. Yang
     * dijaga di sini bukan cuma keamanannya — backend memang tidak
     * membacanya — melainkan bahwa frontend tidak pernah berperilaku
     * seolah identitas bisa dititipkan lewat URL.
     */
    const query = attendanceQuery({
      date_from: '2026-08-01',
      date_to: '2026-08-31',
      // @ts-expect-error — justru itu yang diuji: kunci di luar kontrak.
      employee: 99,
      employee_id: 99,
      user: 99,
    })

    expect(query).not.toContain('employee')
    expect(query).not.toContain('user')
    expect(query).toBe('?date_from=2026-08-01&date_to=2026-08-31')
  })

  it('rentang setengah tidak dikirim sama sekali', () => {
    // Backend menolak `date_from` sendirian dengan 400. Mengirimnya
    // berarti halaman pertama selalu gagal bagi siapa pun yang state-nya
    // sempat setengah terisi.
    expect(attendanceQuery({ date_from: '2026-08-01' })).toBe('')
    expect(attendanceQuery({ date_to: '2026-08-31' })).toBe('')
  })

  it('halaman satu tidak ditulis', () => {
    expect(attendanceQuery({ page: 1 })).toBe('')
    expect(attendanceQuery({ page: 3 })).toBe('?page=3')
  })

  it('ukuran halaman ikut saat disebut', () => {
    expect(attendanceQuery({ page_size: 25 })).toBe('?page_size=25')
  })

  it('tanpa apa pun menghasilkan alamat telanjang', () => {
    expect(attendanceQuery()).toBe('')
  })
})

// ---------------------------------------------------------------------
// 2. Endpoint dan amplop
// ---------------------------------------------------------------------

describe('fetchSelfAttendance', () => {
  it('memanggil endpoint Self Service, bukan endpoint HR', () => {
    expect(SELF_ENDPOINTS.attendance).toBe('/api/me/attendance/')
    expect(SELF_ENDPOINTS.attendance).not.toContain('/hr/')
  })

  it('memulangkan data beserta meta paginasinya', async () => {
    const data = attendanceFixture()

    const request = vi.fn().mockResolvedValue({
      success: true,
      data,
      meta: { count: 19, total_pages: 2, page: 1, page_size: 10 },
    }) as unknown as Requester

    const page = await fetchSelfAttendance(request, {
      date_from: '2026-08-01',
      date_to: '2026-08-31',
    })

    expect(request).toHaveBeenCalledWith(
      '/api/me/attendance/?date_from=2026-08-01&date_to=2026-08-31',
    )
    expect(page.data.summary.present.value).toBe(18)
    expect(page.meta.count).toBe(19)
    expect(page.meta.total_pages).toBe(2)
  })

  it('balasan tanpa meta tetap punya bentuk yang bisa dipakai', async () => {
    // Halaman bercabang atas `meta.total_pages`; `undefined` di situ
    // mematikan tombol berikutnya tanpa satu pun pesan.
    const request = vi.fn().mockResolvedValue({
      data: attendanceFixture(),
    }) as unknown as Requester

    const page = await fetchSelfAttendance(request)

    expect(page.meta).toEqual({
      count: 0,
      total_pages: 1,
      page: 1,
      page_size: 10,
    })
  })
})

// ---------------------------------------------------------------------
// 3. Preset rentang
// ---------------------------------------------------------------------

describe('preset rentang', () => {
  // Rabu, 16 September 2026 — hari yang sama dengan panggung test
  // backend, supaya dua sisi bicara tentang tanggal yang sama.
  const today = new Date(2026, 8, 16)

  it('menulis tanggal lokal, bukan UTC', () => {
    // `toISOString()` pada pukul 00:30 WIB memulangkan tanggal kemarin.
    // Pergeseran itu tidak melempar apa pun — rentangnya cuma meleset
    // sehari, dan hanya bagi yang membukanya dini hari.
    expect(toISO(new Date(2026, 0, 1, 0, 30))).toBe('2026-01-01')
    expect(toISO(new Date(2026, 11, 31, 23, 45))).toBe('2026-12-31')
  })

  it('tujuh hari berakhir hari ini dan memuat hari ini', () => {
    expect(presetRange('last7', today)).toEqual({
      date_from: '2026-09-10',
      date_to: '2026-09-16',
    })
  })

  it('lebar preset sesuai namanya', () => {
    for (const [code, days] of [
      ['last7', 7],
      ['last14', 14],
      ['last30', 30],
    ] as const) {
      expect(rangeDays(presetRange(code, today)!), code).toBe(days)
    }
  })

  it('bulan ini berhenti di hari ini, bukan di akhir bulan', () => {
    // Rentang yang membentang ke masa depan membuat "Tidak Hadir"
    // menghitung hari yang belum terjadi.
    expect(presetRange('thisMonth', today)).toEqual({
      date_from: '2026-09-01',
      date_to: '2026-09-16',
    })
  })

  it('bulan lalu penuh dari tanggal 1 sampai hari terakhirnya', () => {
    expect(presetRange('lastMonth', today)).toEqual({
      date_from: '2026-08-01',
      date_to: '2026-08-31',
    })
  })

  it('bulan lalu benar di batas tahun', () => {
    expect(presetRange('lastMonth', new Date(2026, 0, 15))).toEqual({
      date_from: '2025-12-01',
      date_to: '2025-12-31',
    })
  })

  it('bulan lalu benar untuk Februari, termasuk tahun kabisat', () => {
    expect(presetRange('lastMonth', new Date(2027, 2, 10))).toEqual({
      date_from: '2027-02-01',
      date_to: '2027-02-28',
    })

    expect(presetRange('lastMonth', new Date(2028, 2, 10))).toEqual({
      date_from: '2028-02-01',
      date_to: '2028-02-29',
    })
  })

  it('bulan lalu tidak meleset saat hari ini tanggal 31', () => {
    // `setMonth(-1)` pada 31 Maret menghasilkan 3 Maret, bukan Februari.
    // Bentuk `new Date(y, m, 1)` yang dipakai tidak punya jebakan itu.
    expect(presetRange('lastMonth', new Date(2026, 2, 31))).toEqual({
      date_from: '2026-02-01',
      date_to: '2026-02-28',
    })
  })

  it('kustom tidak menebak rentang apa pun', () => {
    expect(presetRange('custom', today)).toBeNull()
  })

  it('tidak ada preset yang melewati batas backend', () => {
    // Backend menolak di atas 90 hari. Preset yang melewatinya akan
    // membuat sebuah tombol selalu gagal — dan tombol yang selalu gagal
    // lebih buruk daripada tombol yang tidak ada.
    for (const code of PRESETS) {
      const range = presetRange(code, today)

      if (range)
        expect(rangeDays(range), code).toBeLessThanOrEqual(90)
    }
  })

  it('preset dikenali kembali dari rentangnya', () => {
    for (const code of PRESETS) {
      const range = presetRange(code, today)

      if (range)
        expect(matchPreset(range, today), code).toBe(code)
    }
  })

  it('rentang bebas jatuh ke kustom', () => {
    expect(
      matchPreset({ date_from: '2026-08-10', date_to: '2026-08-16' }, today),
    ).toBe('custom')
  })
})

// ---------------------------------------------------------------------
// 4. Katalog
// ---------------------------------------------------------------------

describe('katalog Kehadiran Saya', () => {
  it('lengkap di kedua bahasa', () => {
    expect(Object.keys(en.attendance).sort())
      .toEqual(Object.keys(id.attendance).sort())

    for (const group of ['presets', 'summary', 'outcome'] as const) {
      expect(Object.keys(en.attendance[group]).sort(), group)
        .toEqual(Object.keys(id.attendance[group]).sort())
    }

    expect(Object.keys(en.attendance.history.columns).sort())
      .toEqual(Object.keys(id.attendance.history.columns).sort())
  })

  it('benar-benar diterjemahkan, bukan disalin', () => {
    expect(en.attendance.title).not.toBe(id.attendance.title)
    expect(en.attendance.summary.workDays).not.toBe(id.attendance.summary.workDays)
    expect(en.attendance.presets.lastMonth).not.toBe(id.attendance.presets.lastMonth)
  })

  it('setiap hasil harian punya kata-katanya', () => {
    for (const outcome of ['present', 'late', 'absent', 'leave', 'business_trip', 'extra', 'off']) {
      expect(en.attendance.outcome, outcome).toHaveProperty(outcome)
      expect(id.attendance.outcome, outcome).toHaveProperty(outcome)
    }
  })

  it('durasi punya katalognya sendiri, lepas dari kartu Lembur', () => {
    /*
     * `durationText()` dibaca kartu Lembur di `/me` **dan** kartu Jam
     * Kerja di sini. Selama kuncinya bernama `cards.overtime.*`, satu
     * perbaikan kalimat lembur akan ikut mengubah cara jam kerja
     * ditulis — dan tidak ada yang menyadarinya sampai ada yang
     * membacanya.
     */
    for (const locale of [en, id]) {
      expect(locale.duration.hours).toBeTruthy()
      expect(locale.duration.hoursMinutes).toBeTruthy()
      expect(locale.duration.minutes).toBeTruthy()
      expect(locale.cards.overtime).not.toHaveProperty('hours')
    }
  })

  it('keadaan izin ber-field, tidak menumpang katalog status bersama', () => {
    /*
     * Bukan gaya penulisan — ini penjaga regresi.
     *
     * `partial` sudah dipakai domain lain sebagai "Partially Paid".
     * Menaruh kata milik kolom ini di `common.status.*` mengganti nama
     * status pembayaran di seluruh aplikasi, tanpa satu pun pesan.
     * `codes.permission_state.*` dicoba `codeLabel()` lebih dulu, jadi
     * kolom ini punya kata-katanya sendiri tanpa menyentuh siapa pun.
     */
    expect(en.attendance).not.toHaveProperty('permissionState')
    expect(id.attendance).not.toHaveProperty('permissionState')

    expect(commonEn.status).not.toHaveProperty('partial')
    expect(commonId.status).not.toHaveProperty('partial')

    for (const state of ['pending', 'excused', 'partial', 'unauthorized']) {
      expect(codesEn.permission_state, state).toHaveProperty(state)
      expect(codesId.permission_state, state).toHaveProperty(state)
    }
  })

  it('sumber presensi memakai katalog status bersama', () => {
    // Kodenya (`device`, `manual`, …) tidak bentrok lintas domain dan
    // sudah dibaca seluruh tabel HR dari sana — jadi di sinilah ia
    // memang seharusnya tinggal.
    for (const source of ['manual', 'device', 'mobile', 'web', 'import', 'api', 'system']) {
      expect(commonEn.status, source).toHaveProperty(source)
      expect(commonId.status, source).toHaveProperty(source)
    }
  })

  it('tidak ada kalimat "segera hadir" di layar pribadi', () => {
    // Penjaga yang sama dengan `/me`: kartu yang berjanji sesuatu yang
    // belum ada tidak memberi tahu apa pun yang bisa ditindaklanjuti.
    const text = JSON.stringify({ en: en.attendance, id: id.attendance }).toLowerCase()

    for (const phrase of ['coming soon', 'segera hadir', 'belum tersedia', 'not available yet']) {
      expect(text, phrase).not.toContain(phrase)
    }
  })
})
