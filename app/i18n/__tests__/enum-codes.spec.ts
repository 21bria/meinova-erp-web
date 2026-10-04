import { afterEach, describe, expect, it } from 'vitest'

import { messages } from '../messages'

/*
| Stage 2A — label enum workflow diselesaikan di frontend, per bahasa.
|
| Yang dijaga di sini dua hal yang sama pentingnya:
|
|   1. `id` menerima terjemahan; `en` menerima kalimat Inggris dari API
|   2. kolom `_name` — nama milik tenant — TIDAK PERNAH tersentuh
|
| Nomor 2 yang paling mudah rusak tanpa disadari, dan paling mahal
| kalau rusak: "Plant Maintenance" yang berubah jadi sesuatu yang lain
| adalah data bisnis yang diterjemahkan.
*/

function fakeComposer(locale: 'en' | 'id') {
  const flat = new Map<string, string>()

  const walk = (obj: any, prefix = '') => {
    for (const [key, value] of Object.entries(obj ?? {})) {
      const path = prefix ? `${prefix}.${key}` : key

      if (value && typeof value === 'object')
        walk(value, path)
      else
        flat.set(path, String(value))
    }
  }

  walk(messages[locale])

  return {
    locale: { value: locale },
    t: (key: string) => flat.get(key) ?? key,
    te: (key: string) => flat.has(key),
  }
}

function withLocale(locale: 'en' | 'id') {
  ;(globalThis as any).useNuxtApp = () => ({ $i18n: fakeComposer(locale) })
}

afterEach(() => {
  delete (globalThis as any).useNuxtApp
})

async function load() {
  return import('@framework/core/utils/i18n')
}

describe('enumCodeField — batas antara enum sistem dan data tenant', () => {
  it('mengenali akhiran tampilan enum', async () => {
    const { enumCodeField } = await load()

    expect(enumCodeField('status_label')).toBe('status')
    expect(enumCodeField('approver_type_label')).toBe('approver_type')
    expect(enumCodeField('action_type_display')).toBe('action_type')
  })

  it('tIDAK mengenali `_name` — itu nama milik tenant', async () => {
    const { enumCodeField } = await load()

    // Inilah baris yang menjaga "Plant Maintenance" tetap "Plant
    // Maintenance". Kalau `_name` ikut, setiap nama departemen,
    // perusahaan, dan lokasi jadi kandidat terjemahan.
    expect(enumCodeField('department_name')).toBeNull()
    expect(enumCodeField('company_name')).toBeNull()
    expect(enumCodeField('definition_name')).toBeNull()
    expect(enumCodeField('approver_role_name')).toBeNull()
  })

  it('menolak nama kolom yang cuma terdiri dari akhirannya', async () => {
    const { enumCodeField } = await load()

    expect(enumCodeField('_label')).toBeNull()
    expect(enumCodeField('label')).toBeNull()
    expect(enumCodeField('')).toBeNull()
  })
})

describe('codeLabel — status workflow', () => {
  const wajib: Array<[string, string, string]> = [
    ['approved', 'Approved', 'Disetujui'],
    ['rejected', 'Rejected', 'Ditolak'],
    ['pending', 'Pending', 'Menunggu'],
    ['draft', 'Draft', 'Draf'],
    ['returned', 'Returned', 'Dikembalikan'],
    ['cancelled', 'Cancelled', 'Dibatalkan'],
    ['skipped', 'Skipped', 'Dilewati'],
  ]

  for (const [code, en, id] of wajib) {
    it(`"${code}" -> ${en} / ${id}`, async () => {
      withLocale('en')
      let mod = await load()
      expect(mod.codeLabel('status', code, en)).toBe(en)

      withLocale('id')
      mod = await load()
      expect(mod.codeLabel('status', code, en)).toBe(id)
    })
  }
})

describe('codeLabel — enum khusus workflow', () => {
  it('approver_type diterjemahkan per field', async () => {
    withLocale('id')
    const { codeLabel } = await load()

    expect(codeLabel('approver_type', 'role', 'Role Holder')).toBe('Pemegang Peran')
    expect(codeLabel('approver_type', 'manager', 'Direct Manager')).toBe('Atasan Langsung')
    expect(codeLabel('approver_type', 'department_head', 'Department Head'))
      .toBe('Kepala Departemen')
  })

  it('approver_scope dan approval_mode juga', async () => {
    withLocale('id')
    const { codeLabel } = await load()

    expect(codeLabel('approver_scope', 'location', 'Location')).toBe('Lokasi')
    expect(codeLabel('approver_scope', 'tenant', 'Entire Tenant')).toBe('Seluruh Tenant')
    expect(codeLabel('approval_mode', 'any', 'Any Approver')).toBe('Cukup Salah Satu')
  })

  it('en mengembalikan kalimat Inggris, bukan kode mentah', async () => {
    withLocale('en')
    const { codeLabel } = await load()

    expect(codeLabel('approver_type', 'role', 'Role Holder')).toBe('Role Holder')
    expect(codeLabel('approver_scope', 'location', 'Location')).toBe('Location')
  })

  it('ruang kunci terpisah per field — `role` milik satu enum saja', async () => {
    withLocale('id')
    const { codeLabel } = await load()

    // `role` ada di approver_type dan assignment_type, dan tidak boleh
    // memungut label dari field lain yang kebetulan sama kodenya.
    expect(codeLabel('approver_type', 'role', 'Role Holder')).toBe('Pemegang Peran')
    expect(codeLabel('assignment_type', 'role', 'Role Holder')).toBe('Pemegang Peran')

    // Field yang tidak punya katalog jatuh ke label API, bukan memungut
    // milik approver_type.
    expect(codeLabel('some_other_field', 'role', 'Role Holder')).toBe('Role Holder')
  })
})

describe('codeLabel — jatuh ke label Inggris dari API', () => {
  it('kode tanpa terjemahan memakai label backend', async () => {
    withLocale('id')
    const { codeLabel } = await load()

    expect(codeLabel('status', 'settled', 'Settled')).toBe('Settled')
  })

  it('tanpa label backend, kodenya sendiri yang tampil', async () => {
    withLocale('id')
    const { codeLabel } = await load()

    expect(codeLabel('status', 'settled')).toBe('settled')
  })

  it('nilai kosong tidak menghasilkan teks aneh', async () => {
    withLocale('id')
    const { codeLabel } = await load()

    expect(codeLabel('status', null, 'x')).toBe('x')
    expect(codeLabel('status', '', null)).toBe('')
  })
})
