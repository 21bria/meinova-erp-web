import type { Requester } from '../api/client'

import type { SelfProfile } from '../types'
import { describe, expect, it, vi } from 'vitest'
import {
  fetchSelfAvatarBlob,
  fetchSelfContext,
  fetchSelfProfile,
  SELF_ENDPOINTS,
  toSelfError,
} from '../api/client'

/*
| Lapisan data Self Service, diuji sungguhan.
|
| Repo ini menjalankan vitest di lingkungan `node` tanpa DOM dan tanpa
| `@vue/test-utils`, jadi render komponen belum bisa diuji di sini.
| Karena itu logikanya ditaruh di fungsi biasa ber-argumen pengirim
| permintaan: yang paling gampang salah diam-diam — alamat mana yang
| dipanggil dan bagaimana galat diterjemahkan — tetap terjaga.
*/

function profileFixture(): SelfProfile {
  return {
    identity: {
      id: 7,
      employee_number: 'HO006',
      first_name: 'Adrian',
      last_name: 'Mahendra',
      full_name: 'Adrian Mahendra',
      is_active: true,
    },
    photo: { url: null, source: null, initials: 'AM' },
    personal: {
      gender: { id: 1, code: 'M', name: 'Male' },
      birth_place: 'Kota Tangerang Selatan',
      birth_date: '1978-05-19',
      marital_status: null,
      nationality: null,
      blood_type: null,
      religion: null,
    },
    contact: {
      personal_email: 'adrian@mail.example',
      work_email: 'adrian@meinova.example',
      phone: '0335372336',
      mobile: '089252269707',
      address: 'Jl. Alam Sutera Boulevard No. 3',
      province: { id: 26, code: '36', name: 'Banten' },
      city: null,
      district: null,
      village: null,
    },
    employment: {
      status: { id: 1, code: 'ACTIVE', name: 'Active' },
      type: null,
      join_date: '2017-02-01',
      effective_date: null,
      confirmation_date: null,
      job_location: 'Jakarta Head Office',
    },
    organization: {
      company: { id: 1, code: 'MNI', name: 'Meinova' },
      branch: null,
      location: null,
      division: null,
      department: null,
      section: null,
      position: null,
      job_level: null,
      job_grade: null,
      cost_center: null,
      supervisor: null,
      effective_date: null,
    },
    emergency_contact: { name: '', phone: '' },
  }
}

/**
 * Tiruan galat `$fetch`.
 *
 * `$fetch` melempar `FetchError` — sebuah `Error` yang membawa
 * `.response` dan `.data`. Dibuat begitu di sini, bukan sebagai objek
 * polos, supaya yang diuji memang bentuk yang akan ditemui kode ini di
 * produksi.
 */
function fetchError(status: number, code?: string) {
  return Object.assign(new Error(`HTTP ${status}`), {
    response: { status },
    data: code ? { code } : undefined,
  })
}

/** Pengirim palsu yang mencatat alamat yang diminta. */
function recorder(result: unknown = {}) {
  const calls: string[] = []

  const request = vi.fn(async (path: string) => {
    calls.push(path)

    return result
  }) as unknown as Requester

  return { request, calls }
}

describe('alamat endpoint', () => {
  it('memakai kontrak Self Service, bukan endpoint HR lama', () => {
    expect(SELF_ENDPOINTS.context).toBe('/api/me/')
    expect(SELF_ENDPOINTS.profile).toBe('/api/me/profile/')
    expect(SELF_ENDPOINTS.avatar).toBe('/api/me/avatar/')
  })

  it('tidak satu pun menyentuh /api/hr/employees/me/', () => {
    for (const path of Object.values(SELF_ENDPOINTS))
      expect(path).not.toContain('/api/hr/')
  })

  it('profil dimuat dari /api/me/profile/', async () => {
    const { request, calls } = recorder({ data: profileFixture() })

    await fetchSelfProfile(request)

    expect(calls).toEqual(['/api/me/profile/'])
    expect(calls.some(path => path.includes('/api/hr/employees/me/'))).toBe(false)
  })

  it('konteks dimuat dari /api/me/', async () => {
    const { request, calls } = recorder({ data: { id: 1 } })

    await fetchSelfContext(request)

    expect(calls).toEqual(['/api/me/'])
  })

  it('foto diminta sebagai blob dari /api/me/avatar/', async () => {
    const calls: { path: string, responseType?: string }[] = []

    const request = (async (path: string, opts?: { responseType?: string }) => {
      calls.push({ path, responseType: opts?.responseType })

      return new Blob(['x'])
    }) as unknown as Requester

    await fetchSelfAvatarBlob(request)

    expect(calls).toEqual([
      { path: '/api/me/avatar/', responseType: 'blob' },
    ])
  })
})

describe('amplop balasan', () => {
  it('isi diambil dari kunci data', async () => {
    const fixture = profileFixture()
    const { request } = recorder({ success: true, data: fixture })

    await expect(fetchSelfProfile(request)).resolves.toEqual(fixture)
  })

  it('balasan tanpa amplop diterima apa adanya', async () => {
    const fixture = profileFixture()
    const { request } = recorder(fixture)

    await expect(fetchSelfProfile(request)).resolves.toEqual(fixture)
  })
})

describe('penerjemahan galat', () => {
  it.each([
    ['employee_not_linked', 404],
    ['employee_inactive', 403],
    ['avatar_not_set', 404],
    ['avatar_unavailable', 502],
  ])('kode %s dikenali', (code, status) => {
    const parsed = toSelfError(fetchError(status, code))

    expect(parsed).toEqual({ code, status })
  })

  it('401 tanpa kode tetap terbaca sebagai belum terautentikasi', () => {
    expect(toSelfError(fetchError(401))).toEqual({
      code: 'not_authenticated',
      status: 401,
    })
  })

  it('kode asing tidak diteruskan apa adanya', () => {
    // Layar bercabang atas nilai ini; cabang yang menerima sembarang
    // string dari jaringan adalah cabang yang tidak bisa dipastikan
    // lengkap.
    expect(toSelfError(fetchError(500, 'wat'))).toEqual({
      code: 'unknown',
      status: 500,
    })
  })

  it('galat jaringan tanpa respons tetap punya bentuk', () => {
    expect(toSelfError(new Error('boom'))).toEqual({ code: 'unknown', status: 0 })
  })
})

describe('fallback foto', () => {
  it('404 avatar_not_set berarti tidak ada foto, bukan galat', async () => {
    const request = (async () => {
      throw fetchError(404, 'avatar_not_set')
    }) as unknown as Requester

    await expect(fetchSelfAvatarBlob(request)).resolves.toBeNull()
  })

  it('404 polos juga jatuh ke inisial', async () => {
    const request = (async () => {
      throw fetchError(404)
    }) as unknown as Requester

    await expect(fetchSelfAvatarBlob(request)).resolves.toBeNull()
  })

  it('gangguan sungguhan tidak menyamar jadi "belum punya foto"', async () => {
    const boom = fetchError(500)

    const request = (async () => {
      throw boom
    }) as unknown as Requester

    await expect(fetchSelfAvatarBlob(request)).rejects.toBe(boom)
  })
})

describe('kontrak tidak memuat data sensitif', () => {
  it('bentuk profil tidak punya tempat untuk gaji maupun catatan HR', () => {
    const keys = new Set<string>()

    const walk = (node: unknown) => {
      if (node && typeof node === 'object' && !Array.isArray(node)) {
        for (const [key, value] of Object.entries(node)) {
          keys.add(key)
          walk(value)
        }
      }
    }

    walk(profileFixture())

    for (const forbidden of [
      'notes',
      'organization_notes',
      'employment_notes',
      'basic_salary',
      'salary_grade',
      'bpjs_kesehatan_number',
      'tax_number',
      'nik',
      'avatar_file',
      'user',
    ])
      expect(keys.has(forbidden)).toBe(false)
  })
})
