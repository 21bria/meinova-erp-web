import type { Requester } from '../api/client'

import type { SelfWorkspace } from '../types'
import { describe, expect, it, vi } from 'vitest'

import commonEn from '../../../i18n/locales/en/common'
import en from '../../../i18n/locales/en/me'
import commonId from '../../../i18n/locales/id/common'
import id from '../../../i18n/locales/id/me'
import {
  fetchSelfWorkspace,
  SELF_ENDPOINTS,
  toSelfError,
} from '../api/client'
import { durationText } from '../format'
import { ATTENDANCE_TINTS, ATTENDANCE_VARIANTS, CARD_TEXT } from '../ui'

/*
| Ruang Kerja Saya — lapisan data dan cara menulis angkanya.
|
| Yang tidak bisa diuji di sini: render komponen. Repo ini menjalankan
| vitest di lingkungan `node` tanpa DOM. Karena itu semua yang mudah
| salah diam-diam sengaja **tidak** tinggal di dalam `<template>` —
| alamat endpoint, penerjemahan galat, dan perakitan angka jadi fungsi
| biasa yang bisa dipanggil langsung dari sini. Sisanya dijamin UAT
| browser (`scripts/uat/self-service.mjs`).
*/

function workspaceFixture(): SelfWorkspace {
  return {
    identity: {
      id: 130,
      employee_number: 'HO006',
      first_name: 'Adrian',
      last_name: 'Mahendra',
      full_name: 'Adrian Mahendra',
      is_active: true,
      avatar: { url: null, source: null, initials: 'AM' },
    },
    hero: {
      position: { id: 1, code: 'GM', name: 'General Manager' },
      department: { id: 2, code: 'BOD', name: 'Board of Directors' },
      company: { id: 3, code: 'MMR', name: 'Meinova Mineral Resources' },
      location: { id: 4, code: 'JKT-HO', name: 'Jakarta Head Office' },
      employment_status: { id: 5, code: 'ACTIVE', name: 'Active' },
      employment_type: { id: 6, code: 'PERM', name: 'Permanent' },
    },
    as_of: '2026-09-16',
    schedule: {
      state: 'ready',
      rotation_state: 'work',
      rotation_state_label: 'On Site',
      shift_name: 'Office',
      time_label: '10:00–18:00',
      location: { id: 4, code: 'JKT-HO', name: 'Jakarta Head Office' },
      action: { code: 'schedule', route: '/hr/shift-calendar?mode=my' },
    },
    attendance: {
      state: 'empty',
      status: null,
      status_label: '',
      check_in: null,
      check_out: null,
      late_minutes: 0,
      early_leave_minutes: 0,
      action: { code: 'attendance', route: '/hr/attendance' },
    },
    requests: {
      state: 'empty',
      waiting_for_me: 0,
      my_open_submissions: 0,
      approvals_action: { code: 'approvals', route: '/workflow/inbox' },
      submissions_action: { code: 'submissions', route: '/workflow/submissions' },
    },
    leave: {
      state: 'ready',
      year: 2026,
      balances: [
        {
          leave_type: { id: 1, code: 'ANNUAL', name: 'Cuti Tahunan' },
          remaining: 9,
          year: 2026,
        },
      ],
      action: { code: 'leave_request', route: '/hr/leave/create?mode=my' },
    },
    permission: {
      state: 'empty',
      pending_count: 0,
      latest: null,
      action: { code: 'permission_request', route: '/hr/attendance-permissions/create' },
    },
    overtime: {
      state: 'empty',
      period: '2026-09-01',
      total_minutes: 0,
      action: null,
    },
    payslip: { state: 'empty', latest: null, action: null },
    quick_actions: [
      { code: 'profile', route: '/me/profile' },
      { code: 'leave_request', route: '/hr/leave/create' },
    ],
  }
}

describe('alamat ruang kerja', () => {
  it('memanggil `/api/me/workspace/`, satu kali', async () => {
    const request = vi.fn().mockResolvedValue({ data: workspaceFixture() })

    await fetchSelfWorkspace(request as unknown as Requester)

    expect(request).toHaveBeenCalledTimes(1)
    expect(request).toHaveBeenCalledWith('/api/me/workspace/')
  })

  it('membuka amplop `{data}` backend', async () => {
    const fixture = workspaceFixture()

    const request = vi.fn().mockResolvedValue({ success: true, data: fixture })

    expect(await fetchSelfWorkspace(request as unknown as Requester))
      .toEqual(fixture)
  })

  it('menerima balasan tanpa amplop apa adanya', async () => {
    const fixture = workspaceFixture()

    const request = vi.fn().mockResolvedValue(fixture)

    expect(await fetchSelfWorkspace(request as unknown as Requester))
      .toEqual(fixture)
  })

  it('tidak satu pun endpoint membawa pengenal pegawai', () => {
    for (const path of Object.values(SELF_ENDPOINTS)) {
      expect(path).toMatch(/^\/api\/me\//)
      expect(path).not.toMatch(/[<{:?]/)
      expect(path).not.toContain('employee')
      expect(path).not.toContain('id')
    }
  })

  it('tidak memakai endpoint HR yang lama', () => {
    const paths = Object.values(SELF_ENDPOINTS)

    expect(paths).not.toContain('/api/hr/employees/me/')

    for (const path of paths)
      expect(path.startsWith('/api/hr/')).toBe(false)
  })

  it('galat diterjemahkan jadi sebab yang punya arti', () => {
    expect(toSelfError({
      status: 404,
      data: { code: 'employee_not_linked' },
    })).toEqual({ code: 'employee_not_linked', status: 404 })

    expect(toSelfError({ status: 401 }))
      .toEqual({ code: 'not_authenticated', status: 401 })

    expect(toSelfError(new Error('offline')))
      .toEqual({ code: 'unknown', status: 0 })
  })
})

describe('penulisan durasi lembur', () => {
  it('jam penuh ditulis tanpa menit', () => {
    expect(durationText(240))
      .toEqual({ key: 'me.duration.hours', params: { hours: 4 } })
  })

  it('jam dan menit ditulis keduanya, bukan desimal', () => {
    expect(durationText(90)).toEqual({
      key: 'me.duration.hoursMinutes',
      params: { hours: 1, minutes: 30 },
    })
  })

  it('di bawah satu jam ditulis menit saja', () => {
    expect(durationText(45))
      .toEqual({ key: 'me.duration.minutes', params: { minutes: 45 } })
  })

  it('nol dan nilai tak wajar tetap punya bentuk', () => {
    expect(durationText(0).key).toBe('me.duration.minutes')
    expect(durationText(-30).params).toEqual({ minutes: 0 })
    expect(durationText(Number.NaN).params).toEqual({ minutes: 0 })
  })
})

describe('katalog kartu ruang kerja', () => {
  /*
   * Kode yang dikirim backend harus punya kalimatnya di **kedua**
   * bahasa. Kalau salah satu hilang, yang tampil di layar orang adalah
   * kunci mentah — dan itu baru ketahuan saat seseorang membuka
   * halamannya dengan bahasa yang salah.
   */
  const ACTION_CODES = [
    'profile',
    'schedule',
    'attendance',
    'approvals',
    'submissions',
    'leave_request',
    'permission_request',
    'overtime_request',
    'payslip',
  ]

  const ROSTER_STATES = [
    'work',
    'field_break',
    'travel_out',
    'travel_in',
    'off',
    'holiday',
    'recovery',
    'unplanned',
    'not_applicable',
  ]

  /*
   * Status kehadiran dan status dokumen **tidak** punya katalog sendiri
   * di `me.*` — keduanya dibaca dari `common.status.*` lewat
   * `codeLabel()`, katalog yang sama dengan seluruh tabel HR. Yang
   * dijaga di sini: katalog bersama itu benar-benar memuat setiap kode
   * yang dikirim endpoint workspace, di kedua bahasa. Kalau satu hilang,
   * yang tampil di kartu adalah kode mentah (`business_trip`).
   */
  const ATTENDANCE_STATUSES = [
    'present',
    'late',
    'absent',
    'leave',
    'sick',
    'permit',
    'business_trip',
    'remote',
    'holiday',
    'day_off',
    'incomplete',
  ]

  const PERMISSION_STATUSES = [
    'draft',
    'submitted',
    'in_review',
    'approved',
    'rejected',
    'cancelled',
  ]

  const PERMISSION_TYPES = [
    'late_arrival',
    'early_leave',
    'temporary_out',
    'full_day',
  ]

  const CARDS = [
    'schedule',
    'attendance',
    'requests',
    'leave',
    'permission',
    'overtime',
    'payslip',
  ]

  for (const [name, catalog] of [['en', en], ['id', id]] as const) {
    it(`"${name}" punya label untuk setiap kode tombol`, () => {
      for (const code of ACTION_CODES)
        expect(catalog.actions[code as keyof typeof catalog.actions], code).toBeTruthy()
    })

    it(`"${name}" punya label untuk setiap keadaan roster`, () => {
      for (const code of ROSTER_STATES)
        expect(catalog.rosterState[code as keyof typeof catalog.rosterState], code).toBeTruthy()
    })

    it(`"${name}" punya label untuk setiap jenis izin`, () => {
      for (const code of PERMISSION_TYPES)
        expect(catalog.permissionType[code as keyof typeof catalog.permissionType], code).toBeTruthy()
    })

    it(`"${name}" TIDAK menyalin katalog status bersama`, () => {
      expect(catalog).not.toHaveProperty('attendanceStatus')
      expect(catalog).not.toHaveProperty('permissionStatus')
    })

    it(`"${name}" punya judul dan kalimat kosong untuk setiap kartu`, () => {
      for (const card of CARDS) {
        const entry = catalog.cards[card as keyof typeof catalog.cards] as Record<string, string>

        expect(entry?.title, `${card}.title`).toBeTruthy()
        expect(entry?.empty, `${card}.empty`).toBeTruthy()
      }
    })
  }

  for (const [name, common] of [['en', commonEn], ['id', commonId]] as const) {
    it(`"${name}" katalog bersama memuat setiap status kehadiran`, () => {
      for (const code of ATTENDANCE_STATUSES)
        expect(common.status[code as keyof typeof common.status], code).toBeTruthy()
    })

    it(`"${name}" katalog bersama memuat setiap status dokumen`, () => {
      for (const code of PERMISSION_STATUSES)
        expect(common.status[code as keyof typeof common.status], code).toBeTruthy()
    })
  }

  it('tidak ada kalimat "segera hadir" di katalog ruang kerja', () => {
    /*
     * Penjagaan atas keputusan produk, bukan atas kode: kartu
     * placeholder dihapus di tahap ini, dan yang paling mudah terjadi
     * adalah ia kembali sebagai satu kunci katalog yang dipakai satu
     * komponen.
     */
    for (const catalog of [en, id]) {
      const flat = JSON.stringify(catalog).toLowerCase()

      expect(flat).not.toContain('coming soon')
      expect(flat).not.toContain('segera hadir')
      expect(flat).not.toContain('belum tersedia')
      expect(flat).not.toContain('not available yet')
    }
  })
})

describe('badge status kehadiran', () => {
  /*
   * Diuji sebagai **data**, bukan sebagai render.
   *
   * Tenant peragaan tidak punya satu pun baris presensi hari ini dan
   * nol dokumen izin, jadi chip status ini memang belum pernah terlihat
   * di UAT — dan membuat datanya hanya demi tangkapan layar bukan harga
   * yang pantas. Yang bisa dijaga tanpa data adalah keputusannya:
   * setiap kode punya warna, dan warnanya masuk akal.
   */
  const FROM_BACKEND = [
    'present',
    'late',
    'absent',
    'leave',
    'sick',
    'permit',
    'business_trip',
    'remote',
    'holiday',
    'day_off',
    'incomplete',
  ]

  it('setiap status yang dikirim backend punya variant', () => {
    for (const code of FROM_BACKEND)
      expect(ATTENDANCE_VARIANTS[code], code).toBeTruthy()
  })

  it('terlambat dibedakan dari tidak hadir', () => {
    /*
     * Keputusan yang paling mudah hilang saat seseorang merapikan peta
     * warna: telat masuk adalah catatan yang perlu terlihat, bukan
     * pelanggaran yang perlu diteriakkan. Menyamakannya dengan `absent`
     * membuat orang berhenti membedakan keduanya.
     */
    expect(ATTENDANCE_VARIANTS.absent).toBe('destructive')
    expect(ATTENDANCE_VARIANTS.late).not.toBe('destructive')
    expect(ATTENDANCE_TINTS.late).toContain('amber')
  })

  it('hadir dan kerja jarak jauh sama-sama keadaan baik', () => {
    expect(ATTENDANCE_VARIANTS.present).toBe('default')
    expect(ATTENDANCE_VARIANTS.remote).toBe('default')
  })

  it('tiap tint menempel pada kode yang memang punya variant', () => {
    for (const code of Object.keys(ATTENDANCE_TINTS))
      expect(ATTENDANCE_VARIANTS[code], code).toBeTruthy()
  })
})

describe('skala tipografi kartu', () => {
  it('tiga lapis, dan bobotnya menurun', () => {
    /*
     * Kalau `primary` berhenti lebih besar dari `strong`, hierarkinya
     * mati tanpa satu pun test lain yang merah — kartunya tetap render.
     */
    expect(CARD_TEXT.primary).toContain('text-lg')
    expect(CARD_TEXT.strong).toContain('text-sm')
    expect(CARD_TEXT.meta).toContain('text-xs')

    expect(CARD_TEXT.meta).toContain('text-muted-foreground')
    expect(CARD_TEXT.primary).not.toContain('text-muted-foreground')
  })

  it('setiap lapis boleh dipotong barisnya', () => {
    // Nama lokasi dan jenis cuti panjang; tanpa ini merekalah yang
    // pertama mendorong kartu jadi bisa digeser ke samping di ponsel.
    for (const value of Object.values(CARD_TEXT))
      expect(value).toContain('break-words')
  })
})
